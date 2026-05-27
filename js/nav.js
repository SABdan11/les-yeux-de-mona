// Barre de navigation
(function() {

  const rawPage = window.location.pathname.split('/').pop() || 'index.html';
  const page    = rawPage.startsWith('parcours_') ? 'musees.html' : rawPage;

  const items = [
    { href: 'index.html',       icon: '🏠', label: 'Accueil'  },
    { href: 'quiz.html',        icon: '🎯', label: 'Jeu'      },
    { href: 'musees.html',      icon: '🗺️', label: 'Guide'    },
    { href: 'chronologie.html', icon: '📜', label: 'Histoire' },
    { href: 'roman.html',       icon: '🖼️', label: 'Fiches'   },
  ];

  document.body.insertAdjacentHTML('beforeend', `
    <nav class="bottom-nav">
      ${items.map(it => `
        <a href="${it.href}" class="nav-item ${page === it.href ? 'active' : ''}">
          <span class="nav-icon">${it.icon}</span>
          <span class="nav-label">${it.label}</span>
        </a>`).join('')}
    </nav>
  `);

  document.body.style.paddingBottom = '70px';

})();
