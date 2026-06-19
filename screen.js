(function () {
    'use strict';

    // ── Settings toggle sync ──
    const toggle = document.getElementById('invert-highway-toggle');
    if (toggle) {
        toggle.checked = highway.getInverted();
        toggle.addEventListener('change', () => {
            highway.setInverted(toggle.checked);
            updateBtn(toggle.checked);
        });
    }

    // ── Player controls button ──
    const OFF_CLASS = 'px-3 py-1.5 bg-dark-600 hover:bg-dark-500 rounded-lg text-xs text-gray-300 transition';
    const ON_CLASS = 'px-3 py-1.5 bg-purple-900/40 hover:bg-purple-900/60 rounded-lg text-xs text-purple-300 transition';

    function updateBtn(on) {
        const btn = document.getElementById('btn-invert');
        if (btn) btn.className = on ? ON_CLASS : OFF_CLASS;
        if (toggle) toggle.checked = on;
    }

    function injectBtn() {
        const c = document.getElementById('player-controls');
        if (!c || document.getElementById('btn-invert')) return;
        const separator = c.querySelector('span.text-gray-700');
        const b = document.createElement('button');
        b.id = 'btn-invert';
        b.className = highway.getInverted() ? ON_CLASS : OFF_CLASS;
        b.textContent = 'Invert';
        b.title = 'Invert string order';
        b.onclick = () => {
            const on = !highway.getInverted();
            highway.setInverted(on);
            updateBtn(on);
        };
        if (separator && separator.parentNode === c) c.insertBefore(b, separator); else c.appendChild(b);
    }

    // Inject button on each song play
    const _play = window.playSong;
    window.playSong = async function (f, a) {
        await _play(f, a);
        injectBtn();
    };

    // Inject now if player is already open
    injectBtn();
})();
