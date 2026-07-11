// Ying Ying Admin Nav
// Plain script (no module). Include with <script src="/admin-nav.js"></script>.
// Self-initializes on DOMContentLoaded; also exposes window.initAdminNav()
// for pages that want to inject it manually (calling it twice is safe).
(function () {
    'use strict';

    var LINKS = [
        { label: '📋 Dashboard', href: '/staff.html' },
        { label: '🍜 Menu Management', href: '/menu-management.html' }
    ];

    var initialized = false;

    function initAdminNav() {
        if (initialized || document.getElementById('adminNavToggle')) return;
        initialized = true;

        var style = document.createElement('style');
        style.textContent = [
            '#adminNavToggle {',
            '  position: fixed; top: 12px; left: 12px; z-index: 9998;',
            '  width: 40px; height: 40px; border: none; border-radius: 8px;',
            '  background: rgba(45, 80, 22, 0.85); color: #fff;',
            '  font-size: 20px; line-height: 1; cursor: pointer;',
            '  box-shadow: 0 2px 8px rgba(0,0,0,0.25);',
            '}',
            '#adminNavToggle:hover { background: #2d5016; }',
            '#adminNavOverlay {',
            '  position: fixed; inset: 0; z-index: 9999;',
            '  background: rgba(0,0,0,0.4); opacity: 0;',
            '  pointer-events: none; transition: opacity 0.2s ease;',
            '}',
            '#adminNavOverlay.open { opacity: 1; pointer-events: auto; }',
            '#adminNavPanel {',
            '  position: fixed; top: 0; left: 0; bottom: 0; z-index: 10000;',
            '  width: 260px; max-width: 80vw;',
            '  background: #2d5016; color: #fff;',
            '  transform: translateX(-100%); transition: transform 0.2s ease;',
            '  box-shadow: 2px 0 12px rgba(0,0,0,0.3);',
            '  display: flex; flex-direction: column;',
            "  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;",
            '}',
            '#adminNavPanel.open { transform: translateX(0); }',
            '.admin-nav-header {',
            '  display: flex; align-items: center; justify-content: space-between;',
            '  padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.2);',
            '}',
            '.admin-nav-header span { font-weight: bold; font-size: 16px; }',
            '#adminNavClose {',
            '  background: none; border: none; color: #fff;',
            '  font-size: 22px; cursor: pointer; padding: 0 4px;',
            '}',
            '.admin-nav-links { padding: 10px 0; }',
            '.admin-nav-links a {',
            '  display: block; padding: 14px 20px; color: #fff;',
            '  text-decoration: none; font-size: 15px;',
            '}',
            '.admin-nav-links a:hover { background: rgba(255,255,255,0.12); }',
            '.admin-nav-links a.current {',
            '  background: #ff6b35; font-weight: bold;',
            '}'
        ].join('\n');
        document.head.appendChild(style);

        var toggle = document.createElement('button');
        toggle.id = 'adminNavToggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Open admin navigation');
        toggle.textContent = '☰';

        var overlay = document.createElement('div');
        overlay.id = 'adminNavOverlay';

        var panel = document.createElement('nav');
        panel.id = 'adminNavPanel';

        var header = document.createElement('div');
        header.className = 'admin-nav-header';
        var title = document.createElement('span');
        title.textContent = '🍵 Ying Ying Admin';
        var closeBtn = document.createElement('button');
        closeBtn.id = 'adminNavClose';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close navigation');
        closeBtn.textContent = '×';
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        var linksWrap = document.createElement('div');
        linksWrap.className = 'admin-nav-links';
        var currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
        LINKS.forEach(function (link) {
            var a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.label;
            if (currentPath === link.href || currentPath === link.href.replace('.html', '')) {
                a.className = 'current';
            }
            linksWrap.appendChild(a);
        });
        panel.appendChild(linksWrap);

        function openNav() {
            overlay.classList.add('open');
            panel.classList.add('open');
        }
        function closeNav() {
            overlay.classList.remove('open');
            panel.classList.remove('open');
        }

        toggle.addEventListener('click', openNav);
        closeBtn.addEventListener('click', closeNav);
        overlay.addEventListener('click', closeNav);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });

        document.body.appendChild(toggle);
        document.body.appendChild(overlay);
        document.body.appendChild(panel);
    }

    window.initAdminNav = initAdminNav;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminNav);
    } else {
        initAdminNav();
    }
})();
