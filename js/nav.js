// Barre de navigation partagée
(function() {
  // Page active
  const rawPage = window.location.pathname.split('/').pop() || 'index.html';
  const page = rawPage.startsWith('parcours_') ? 'musees.html' : rawPage;

  // Score du profil actif
  const profil   = Profil.getActif();
  const initiale = Profil.initiale(profil);
  const scoreData = JSON.parse(localStorage.getItem('mona_score_' + profil) || '{"reconnu":0,"total":0}');
  const scoreLabel = profil ? (scoreData.reconnu + '/52') : 'Carnet';

  const items = [
    { href: 'quiz.html',        icon: '🃏', label: 'Quiz' },
    { href: 'musees.html',   icon: '🏛️', label: 'Musées' },
    { href: 'chronologie.html', icon: '📅', label: 'Histoire' },
    { href: 'roman.html',       icon: '📖', label: 'Roman' },
  ];

  const navHTML = `
    <nav class="bottom-nav">
      ${items.map(it => `
        <a href="${it.href}" class="nav-item ${page === it.href ? 'active' : ''}">
          <span class="nav-icon">${it.icon}</span>
          <span class="nav-label">${it.label}</span>
        </a>`).join('')}
      <a href="carnet.html" class="nav-item nav-carnet ${page === 'carnet.html' ? 'active' : ''}">
        <div class="nav-avatar">${initiale}</div>
        <span class="nav-label">${profil ? scoreLabel : 'Joueur'}</span>
      </a>
      <a href="index.html" class="nav-item ${page === 'index.html' ? 'active' : ''}">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Accueil</span>
      </a>
    </nav>`;

  document.body.insertAdjacentHTML('beforeend', navHTML);
  document.body.style.paddingBottom = '70px';
})();
