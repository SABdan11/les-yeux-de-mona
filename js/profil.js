// Gestion des profils enfants (localStorage)
const Profil = {
  getActif()   { return localStorage.getItem('mona_profil_actif') || null; },
  setActif(nom){ localStorage.setItem('mona_profil_actif', nom); },
  getListe()   { return JSON.parse(localStorage.getItem('mona_profils') || '[]'); },

  ajouter(nom) {
    nom = nom.trim();
    if (!nom) return;
    const liste = this.getListe();
    if (!liste.includes(nom)) {
      liste.push(nom);
      localStorage.setItem('mona_profils', JSON.stringify(liste));
    }
    this.setActif(nom);
  },

  supprimer(nom) {
    let liste = this.getListe().filter(n => n !== nom);
    localStorage.setItem('mona_profils', JSON.stringify(liste));
    ['mona_vues_', 'mona_favoris_'].forEach(k => localStorage.removeItem(k + nom));
    if (this.getActif() === nom) this.setActif(liste[0] || null);
  },

  keyVues()    { return 'mona_vues_'    + this.getActif(); },
  keyFavoris() { return 'mona_favoris_' + this.getActif(); },
  getVues()    { return JSON.parse(localStorage.getItem(this.keyVues())    || '{}'); },
  getFavoris() { return JSON.parse(localStorage.getItem(this.keyFavoris()) || '[]'); },
  saveVues(v)  { localStorage.setItem(this.keyVues(),    JSON.stringify(v)); },
  saveFavoris(f){ localStorage.setItem(this.keyFavoris(), JSON.stringify(f)); },

  initiale(nom) { return nom ? nom.charAt(0).toUpperCase() : '?'; },
};
