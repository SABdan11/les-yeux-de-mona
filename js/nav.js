// Barre de navigation + modal joueur partagés
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

  // CSS du modal joueur
  const style = document.createElement('style');
  style.textContent = `
    .joueur-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.55); z-index: 200;
      align-items: flex-end; justify-content: center;
    }
    .joueur-overlay.visible { display: flex; }
    .joueur-panel {
      background: white; border-radius: 20px 20px 0 0;
      padding: 24px 20px 40px; width: 100%; max-width: 480px;
    }
    .joueur-panel h3 {
      font-family: 'Playfair Display', serif; font-size: 20px;
      color: #1a3a5c; margin-bottom: 16px;
    }
    .joueur-liste { margin-bottom: 16px; }
    .joueur-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: 10px;
      cursor: pointer; transition: background 0.15s;
    }
    .joueur-item:hover { background: #f4f0ea; }
    .joueur-item.actif { background: #e8eef4; }
    .joueur-item .ji-av {
      width: 30px; height: 30px; border-radius: 50%;
      background: #1a3a5c; color: white;
      font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .joueur-item .ji-nom { flex: 1; font-size: 15px; font-weight: 600; }
    .joueur-item .ji-score { font-size: 12px; color: #c9a84c; font-weight: 700; }
    .joueur-item .ji-actif { font-size: 11px; color: #c9a84c; font-weight: 600; }
    .joueur-item .ji-del { font-size: 18px; color: #ddd; cursor: pointer; padding: 4px; }
    .joueur-item .ji-del:hover { color: #e05555; }
    .joueur-input-row { display: flex; gap: 8px; margin-top: 4px; }
    .joueur-input {
      flex: 1; padding: 12px 14px; border: 2px solid #e0d8ce;
      border-radius: 10px; font-size: 15px;
      font-family: 'Open Sans', sans-serif; outline: none;
    }
    .joueur-input:focus { border-color: #1a3a5c; }
    .joueur-btn-add {
      padding: 12px 18px; background: #1a3a5c; color: white;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .joueur-btn-close {
      width: 100%; margin-top: 12px; padding: 12px;
      background: #f4f0ea; color: #555; border: none;
      border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // HTML nav + modal
  document.body.insertAdjacentHTML('beforeend', `
    <nav class="bottom-nav">
      <button onclick="window.lancerJeu()" class="nav-item ${page === 'quiz.html' ? 'active' : ''}" style="background:none;border:none;cursor:pointer;padding:8px 0;flex:1">
        <span class="nav-icon">🎯</span>
        <span class="nav-label">Jouer</span>
      </button>
      ${items.map(it => `
        <a href="${it.href}" class="nav-item ${page === it.href ? 'active' : ''}">
          <span class="nav-icon">${it.icon}</span>
          <span class="nav-label">${it.label}</span>
        </a>`).join('')}
      <button onclick="window.ouvrirJoueur()" class="nav-item nav-carnet ${page === 'carnet.html' ? 'active' : ''}" style="background:none;border:none;cursor:pointer;padding:8px 0">
        <div class="nav-avatar">${initiale}</div>
        <span class="nav-label" style="display:block">${nom6}</span>
        <span class="nav-label" style="color:#c9a84c;font-size:9px">${scoreLbl}</span>
      </button>
      <a href="index.html" class="nav-item ${page === 'index.html' ? 'active' : ''}">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Accueil</span>
      </a>
    </nav>

    <div class="joueur-overlay" id="joueurOverlay" onclick="if(event.target===this)window.fermerJoueur()">
      <div class="joueur-panel">
        <div class="joueur-liste" id="joueurListe"></div>
        <div class="joueur-input-row">
          <input class="joueur-input" id="joueurInput" type="text" placeholder="Prénom (min. 5 lettres)…" maxlength="20">
          <button class="joueur-btn-add" onclick="window.ajouterJoueur()">Ajouter</button>
        </div>
        <button class="joueur-btn-close" id="joueurBtnClose" onclick="window.fermerJoueur()">Fermer</button>
      </div>
    </div>
  `);

  document.body.style.paddingBottom = '70px';

  // Entrée clavier
  document.getElementById('joueurInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') window.ajouterJoueur();
  });

  function rafraichirListe() {
    const liste = Profil.getListe();
    const actif = Profil.getActif();
    const el    = document.getElementById('joueurListe');

    if (liste.length === 0) {
      el.innerHTML = '<p style="font-size:13px;color:#aaa;margin-bottom:8px">Aucun joueur — entrez un prénom ci-dessous.</p>';
      return;
    }

    el.innerHTML = liste.map(nom => {
      const s = JSON.parse(localStorage.getItem('mona_score_' + nom) || '{"reconnu":0}');
      return `
        <div class="joueur-item ${nom === actif ? 'actif' : ''}" onclick="window.choisirJoueur('${nom}')">
          <div class="ji-av">${Profil.initiale(nom)}</div>
          <div class="ji-nom">${nom}</div>
          <div class="ji-score">${s.reconnu}/52</div>
          ${nom === actif ? '<div class="ji-actif">actif</div>' : ''}
          <div class="ji-del" onclick="event.stopPropagation();window.supprimerJoueur('${nom}')">✕</div>
        </div>`;
    }).join('');

    // Bouton fermer uniquement si un joueur est actif
    document.getElementById('joueurBtnClose').style.display = actif ? 'block' : 'none';
  }

  window.lancerJeu = function() {
    if (Profil.getActif()) {
      window.location.href = 'quiz.html';
    } else {
      _modeJouer = true;
      window.ouvrirJoueur(true);
    }
  };

  window.ouvrirJoueur = function(obligatoire) {
    rafraichirListe();
    document.getElementById('joueurOverlay').classList.add('visible');
    if (obligatoire) {
      document.getElementById('joueurOverlay').onclick = null; // pas de fermeture au clic
      document.getElementById('joueurBtnClose').style.display = 'none';
    }
    setTimeout(() => document.getElementById('joueurInput').focus(), 100);
  };

  window.fermerJoueur = function() {
    document.getElementById('joueurOverlay').classList.remove('visible');
  };

  let _modeJouer = false;

  window.choisirJoueur = function(nom) {
    Profil.setActif(nom);
    if (_modeJouer) { window.location.href = 'quiz.html'; }
    else { setTimeout(() => window.location.reload(), 200); }
  };

  window.ajouterJoueur = function() {
    const nom = document.getElementById('joueurInput').value.trim();
    if (nom.length < 5) {
      document.getElementById('joueurInput').style.borderColor = '#e05555';
      document.getElementById('joueurInput').placeholder = 'Minimum 5 lettres !';
      return;
    }
    Profil.ajouter(nom);
    if (_modeJouer) { window.location.href = 'quiz.html'; }
    else { setTimeout(() => window.location.reload(), 200); }
  };

  window.supprimerJoueur = function(nom) {
    if (!confirm('Supprimer le profil de ' + nom + ' ?')) return;
    Profil.supprimer(nom);
    rafraichirListe();
  };

})();
