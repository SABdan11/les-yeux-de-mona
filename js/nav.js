// Barre de navigation
(function() {

  const rawPage   = window.location.pathname.split('/').pop() || 'index.html';
  const page      = rawPage.startsWith('parcours_') ? 'musees.html' : rawPage;
  const profil    = Profil.getActif();
  const initiale  = Profil.initiale(profil);
  const nom6      = profil ? profil.substring(0, 6) : 'Joueur';
  const scoreData = JSON.parse(localStorage.getItem('mona_score_' + profil) || '{"reconnu":0}');
  const scoreLbl  = profil ? (scoreData.reconnu + '/52') : '—';

  const items = [
    { href: 'musees.html',      icon: '🏛️', label: 'Musées' },
    { href: 'chronologie.html', icon: '📜', label: 'Histoire' },
    { href: 'roman.html',       icon: '📖', label: 'Roman' },
  ];

  document.body.insertAdjacentHTML('beforeend', `
    <nav class="bottom-nav">
      <a href="quiz.html" class="nav-item ${page === 'quiz.html' ? 'active' : ''}">
        <span class="nav-icon">🎯</span>
        <span class="nav-label">Jouer</span>
      </a>
      ${items.map(it => `
        <a href="${it.href}" class="nav-item ${page === it.href ? 'active' : ''}">
          <span class="nav-icon">${it.icon}</span>
          <span class="nav-label">${it.label}</span>
        </a>`).join('')}
      <a href="carnet.html" class="nav-item nav-carnet ${page === 'carnet.html' ? 'active' : ''}">
        <div class="nav-avatar">${initiale}</div>
        <span class="nav-label" style="display:block">${nom6}</span>
        <span class="nav-label" style="color:#c9a84c;font-size:9px">${scoreLbl}</span>
      </a>
      <a href="index.html" class="nav-item ${page === 'index.html' ? 'active' : ''}">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Accueil</span>
      </a>
    </nav>
  `);

  document.body.style.paddingBottom = '70px';

})();
