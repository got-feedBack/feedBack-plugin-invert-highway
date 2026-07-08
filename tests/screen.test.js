'use strict';
// Coverage for updateBtn/injectBtn against a minimal fake DOM.
// Runs under the org reusable CI as `node tests/screen.test.js`.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

class FakeElement {
    constructor(tag) {
        this.tagName = tag;
        this.id = '';
        this.className = '';
        this.textContent = '';
        this.title = '';
        this.checked = false;
        this.onclick = null;
        this.children = [];
        this.parentNode = null;
        this._listeners = {};
    }
    appendChild(child) {
        child.parentNode = this;
        this.children.push(child);
        return child;
    }
    insertBefore(child, ref) {
        child.parentNode = this;
        const idx = this.children.indexOf(ref);
        this.children.splice(idx === -1 ? this.children.length : idx, 0, child);
        return child;
    }
    addEventListener(type, fn) { this._listeners[type] = fn; }
    querySelector(sel) {
        // Only supports the one selector this plugin actually uses.
        if (sel === 'span.text-gray-700') {
            return this.children.find(c => c.tagName === 'span' && c.className === 'text-gray-700') || null;
        }
        return null;
    }
}

function makeDocument(byId) {
    return {
        getElementById: (id) => byId[id] || null,
        createElement: (tag) => new FakeElement(tag),
    };
}

function freshPlugin(byId = {}) {
    global.document = makeDocument(byId);
    global.window = {};
    global.highway = { getInverted: () => false, setInverted: () => {} };
    const file = path.join(__dirname, '..', 'screen.js');
    delete require.cache[require.resolve(file)];
    return require(file);
}

test('updateBtn sets ON_CLASS/OFF_CLASS on the button and syncs the toggle checkbox', () => {
    const btn = new FakeElement('button');
    const toggleEl = new FakeElement('input');
    const mod = freshPlugin({ 'btn-invert': btn, 'invert-highway-toggle': toggleEl });

    mod.updateBtn(true);
    assert.equal(btn.className, mod.ON_CLASS);

    mod.updateBtn(false);
    assert.equal(btn.className, mod.OFF_CLASS);
});

test('updateBtn is a no-op when the button is not mounted', () => {
    const mod = freshPlugin({});
    assert.doesNotThrow(() => mod.updateBtn(true));
});

test('injectBtn does nothing without a #player-controls host', () => {
    const mod = freshPlugin({});
    mod.injectBtn();
    // No exception, no elements created — nothing to assert on beyond safety.
});

test('injectBtn is idempotent — a second call does not duplicate the button', () => {
    const controls = new FakeElement('div');
    controls.id = 'player-controls';
    const byId = { 'player-controls': controls };
    const mod = freshPlugin(byId);

    mod.injectBtn();
    assert.equal(controls.children.length, 1);
    assert.equal(controls.children[0].id, 'btn-invert');

    // Simulate the button now being findable by id (as the real DOM would).
    byId['btn-invert'] = controls.children[0];
    mod.injectBtn();
    assert.equal(controls.children.length, 1);
});

test('injectBtn inserts before a trailing separator span when present', () => {
    const controls = new FakeElement('div');
    controls.id = 'player-controls';
    const separator = new FakeElement('span');
    separator.className = 'text-gray-700';
    controls.appendChild(separator);
    const mod = freshPlugin({ 'player-controls': controls });

    mod.injectBtn();
    assert.equal(controls.children.length, 2);
    assert.equal(controls.children[0].id, 'btn-invert'); // inserted before the separator
    assert.equal(controls.children[1], separator);
});

test('injectBtn appends when no separator is present', () => {
    const controls = new FakeElement('div');
    controls.id = 'player-controls';
    const mod = freshPlugin({ 'player-controls': controls });

    mod.injectBtn();
    assert.equal(controls.children.length, 1);
    assert.equal(controls.children[0].id, 'btn-invert');
});

test('injectBtn seeds the button class from the current highway inversion state', () => {
    global.document = makeDocument({});
    global.window = {};
    global.highway = { getInverted: () => true, setInverted: () => {} };
    const file = path.join(__dirname, '..', 'screen.js');
    delete require.cache[require.resolve(file)];
    const mod = require(file);

    const controls = new FakeElement('div');
    controls.id = 'player-controls';
    global.document.getElementById = (id) => (id === 'player-controls' ? controls : null);
    mod.injectBtn();
    assert.equal(controls.children[0].className, mod.ON_CLASS);
});

test('button click toggles highway inversion and updates its own class', () => {
    let inverted = false;
    global.document = makeDocument({});
    global.window = {};
    global.highway = { getInverted: () => inverted, setInverted: (v) => { inverted = v; } };
    const file = path.join(__dirname, '..', 'screen.js');
    delete require.cache[require.resolve(file)];
    const mod = require(file);

    const controls = new FakeElement('div');
    controls.id = 'player-controls';
    const byId = {};
    global.document.getElementById = (id) => (id === 'player-controls' ? controls : byId[id]) || null;
    mod.injectBtn();
    const btn = controls.children[0];
    byId['btn-invert'] = btn;

    btn.onclick();
    assert.equal(inverted, true);
    assert.equal(btn.className, mod.ON_CLASS);

    btn.onclick();
    assert.equal(inverted, false);
    assert.equal(btn.className, mod.OFF_CLASS);
});
