'use strict';
const DOCS = [
  { cat: 'Cadrage du projet', icon: 'doc', type: 'PDF', title: 'Cahier des charges — Sujet 8', desc: 'Besoin, périmètre, exigences fonctionnelles et indicateurs proposés pour le prototype.', file: 'assets/docs/Cahier_des_charges.pdf' },
  { cat: 'Modèle de données', icon: 'table', type: 'PDF', title: 'Dictionnaire de données', desc: 'Neuf tables, colonnes, types, clés primaires et étrangères, relations du modèle.', file: 'assets/docs/01_Dictionnaire_de_donnees.pdf' },
  { cat: 'Analyse et indicateurs', icon: 'chart', type: 'PDF', title: 'Référentiel des KPI', desc: 'Finalité, règle de calcul et lecture de chaque indicateur, avec les objectifs de référence.', file: 'assets/docs/02_Referentiel_KPI.pdf'},
  { cat: 'Utilisation du dashboard', icon: 'book', type: 'PDF', title: 'Guide utilisateur', desc: 'Navigation entre les six pages, filtres, lecture des graphiques et code couleur.', file: 'assets/docs/03_Guide_utilisateur.pdf' },
  { cat: 'Bilan et perspectives', icon: 'flag', type: 'PDF', title: 'Limites et recommandations', desc: 'Limites identifiées du prototype et pistes d\'évolution.', file:'assets/docs/05_Limites_et_recommandations.pdf' },
  { cat: 'Bilan et perspectives', icon: 'doc', type: 'PDF', title: 'Présentation finale', desc: 'Support de restitution du projet en seize diapositives.', file: 'assets/docs/04_Presentation_Superviseur_Vision.pdf'},
  { cat: 'Bilan et perspectives', icon: 'doc', type: 'PDF', title: 'Compte rendu de stage', desc: 'Déroulé des quatre semaines et bilan des compétences.', file: 'assets/docs/06_Compte_rendu_de_stage.pdf' },
  { cat: 'Fichiers techniques', icon: 'code', type: 'SQL', title: 'Script de création des tables', desc: 'Création de la base SuperviseurVision, de ses tables et de ses contraintes.', file: 'assets/docs/Creation_des_tables.sql'},
  { cat: 'Fichiers techniques', icon: 'code', type: 'SQL', title: 'Script de remplissage', desc: 'Génération du jeu de données fictif de démonstration.', file: 'assets/docs/Remplissage_des_tables.sql' },
  {cat: 'Fichiers techniques',
  icon: 'code',
  type: 'SQL',
  title: 'Script des affectations et de la charge par phase',
  desc: 'Gestion des affectations des intervenants aux dossiers et pondération de la charge de travail selon les phases.',
  file: 'assets/docs/Intervenant.sql'},
  { cat: 'Fichiers techniques', icon: 'chart', type: 'PBIX', title: 'Modèle Power BI', desc: 'Fichier du tableau de bord, ouvrable dans Power BI Desktop.', file: 'assets/docs/Superviseur_Vision.pbix' }
];

/* ---------- Données de contenu (sources : documents du projet) ---------- */
const ICONS = {
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  table: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M10 10v9"/>',
  chart: '<path d="M4 20V4M4 20h16M8 16v-5M13 16V8M18 16v-3"/>',
  book: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10"/>',
  flag: '<path d="M6 21V4M6 5h11l-2 4 2 4H6"/>',
  code: '<path d="M9 8l-5 4 5 4M15 8l5 4-5 4M13 5l-2 14"/>'
};

const TABLES = [
  { n: 'Dossier', g: 'Table centrale', role: 'Un enregistrement par dossier ou site suivi : attributs descriptifs et clés vers la phase, le statut et le responsable d\'origine.', cols: [
    ['dossier_id', 'INT IDENTITY', 'PK'], ['code_dossier', 'NVARCHAR(20)', 'UNIQUE'], ['nom_site', 'NVARCHAR(100)'], ['region', 'NVARCHAR(50)'], ['type_dossier', 'NVARCHAR(50)'], ['client_projet', 'NVARCHAR(100)'], ['criticite', 'NVARCHAR(20)'], ['date_creation', 'DATE'], ['phase_id', 'INT', 'FK → Phase'], ['statut_id', 'INT', 'FK → Statut'], ['intervenant_id', 'INT', 'FK → Intervenant']] },
  { n: 'Phase', g: 'Référentiel', role: 'Les sept étapes du cycle de vie d\'un dossier ; chaque dossier est rattaché à sa phase actuelle.', cols: [['phase_id', 'INT IDENTITY', 'PK'], ['nom_phase', 'NVARCHAR(50)', 'UNIQUE']] },
  { n: 'Statut', g: 'Référentiel', role: 'Les six statuts possibles : non démarré, en cours, en attente, bloqué, terminé, validé.', cols: [['statut_id', 'INT IDENTITY', 'PK'], ['nom_statut', 'NVARCHAR(50)', 'UNIQUE']] },
  { n: 'Intervenant', g: 'Référentiel', role: 'Les personnes qui interviennent sur les dossiers, avec leur rôle, leur unité et leur zone.', cols: [['intervenant_id', 'INT IDENTITY', 'PK'], ['nom_intervenant', 'NVARCHAR(100)'], ['role', 'NVARCHAR(50)'], ['unite', 'NVARCHAR(50)'], ['zone', 'NVARCHAR(50)']] },
  { n: 'Dossier_Intervenant', g: 'Liaison', role: 'Relation many-to-many entre dossiers et intervenants : un responsable principal et des collaborateurs. Un intervenant ne peut être affecté qu\'une fois à un même dossier.', cols: [['dossier_intervenant_id', 'INT IDENTITY', 'PK'], ['dossier_id', 'INT', 'FK → Dossier'], ['intervenant_id', 'INT', 'FK → Intervenant'], ['role_affectation', 'NVARCHAR(50)'], ['est_principal', 'BIT'], ['date_affectation', 'DATE']] },
  { n: 'Echeance', g: 'Suivi', role: 'Dates clés d\'un dossier : date cible, date prévue et date réelle de clôture. Base du calcul des retards.', cols: [['echeance_id', 'INT IDENTITY', 'PK'], ['dossier_id', 'INT', 'FK → Dossier'], ['date_cible', 'DATE'], ['date_prevue', 'DATE'], ['date_reelle', 'DATE']] },
  { n: 'Blocage', g: 'Suivi', role: 'Historique des blocages : nature, date d\'apparition, état de résolution (en cours, non résolu, résolu) et impact estimé.', cols: [['blocage_id', 'INT IDENTITY', 'PK'], ['dossier_id', 'INT', 'FK → Dossier'], ['type_blocage', 'NVARCHAR(100)'], ['date_apparition', 'DATE'], ['etat_resolution', 'NVARCHAR(20)'], ['impact_estime', 'NVARCHAR(20)'], ['commentaire', 'NVARCHAR(255)']] },
  { n: 'Evenement', g: 'Suivi', role: 'Journal des événements d\'un dossier (création, changement de phase, relance, commentaire). Alimente l\'historique de la fiche dossier.', cols: [['evenement_id', 'INT IDENTITY', 'PK'], ['dossier_id', 'INT', 'FK → Dossier'], ['date_evenement', 'DATETIME'], ['type_evenement', 'NVARCHAR(50)'], ['commentaire', 'NVARCHAR(255)']] },
  { n: 'Phase_Poids', g: 'Pondération', role: 'Coefficient de charge par phase, de 0,5 (Validation) à 1,5 (DAO et APD), utilisé pour la charge pondérée des intervenants.', cols: [['phase_id', 'INT', 'PK / FK → Phase'], ['poids_charge', 'DECIMAL(4,2)']] }
];

const KPIS = [
  { n: 'Volume et état du portefeuille', items: [
    ['Nombre total de dossiers', 'KPI-01', 'Donner le volume global supervisé.', 'Comptage des lignes de la table Dossier.', 'Sert de base de comparaison à tous les taux.'],
    ['Dossiers par phase et par statut', 'KPI-02 · 03', 'Voir où le flux s\'engorge et le poids du stock actif.', 'Comptage regroupé par phase, puis par statut.', 'Une phase qui concentre beaucoup de dossiers signale un engorgement potentiel.'],
    ['Âge moyen des dossiers ouverts', 'KPI-07', 'Mesurer l\'ancienneté moyenne du stock.', 'Jours entre la création et aujourd\'hui, hors statuts Terminé et Validé.', 'Un âge élevé traduit une tension globale du portefeuille.'],
    ['Taux de clôture', 'KPI-10', 'Mesurer la part du portefeuille menée à terme.', 'Dossiers Terminé ou Validé ÷ total des dossiers.', 'Comparé à un objectif de 50 %, affiché en jauge.']] },
  { n: 'Délais et retards', items: [
    ['Nombre et taux de dossiers en retard', 'KPI-04 · 05', 'Repérer les dossiers qui dépassent leur échéance.', 'Règle de gestion : date cible dépassée et statut ni Terminé ni Validé.', 'Taux comparé à un objectif de 15 %, avec un code couleur à trois niveaux.'],
    ['Retard moyen et retard maximum', 'Complémentaire', 'Mesurer l\'ampleur des retards, pas seulement leur nombre.', 'Moyenne et maximum des jours de dépassement.', 'Un retard moyen élevé avec peu de dossiers signale quelques cas très problématiques.']] },
  { n: 'Blocages', items: [
    ['Nombre de dossiers bloqués', 'KPI-06', 'Repérer les points d\'arrêt opérationnels.', 'Dossiers distincts ayant au moins un blocage « En cours » ou « Non résolu ».', 'Taux comparé à un objectif de 10 %.'],
    ['Taux de résolution des blocages', 'Complémentaire', 'Mesurer la capacité à traiter les blocages.', 'Blocages résolus (ou non résolus) ÷ blocages enregistrés.', 'Un taux de non-résolution élevé signale un flux de traitement insuffisant.'],
    ['Ancienneté des blocages', 'Complémentaire', 'Repérer les blocages qui traînent.', 'Jours entre la date d\'apparition et aujourd\'hui.', 'Sert à trier les cas les plus anciens en premier.']] },
  { n: 'Charge par intervenant', items: [
    ['Charge individuelle', 'KPI-08', 'Voir combien de dossiers actifs porte chacun.', 'Dossiers non démarrés, en cours, en attente ou bloqués, via Dossier_Intervenant.', 'Comparée à un seuil de charge maximal réglable.'],
    ['Charge pondérée par phase', 'KPI-09', 'Tenir compte du fait que certaines phases demandent plus de travail.', 'Somme des poids de phase (0,5 à 1,5) des dossiers actifs.', 'Deux intervenants au même nombre de dossiers peuvent avoir des charges très différentes.'],
    ['Intervenants en surcharge', 'Complémentaire', 'Mesurer la part de l\'effectif au-dessus du seuil.', 'Comparaison de la charge au seuil réglable par curseur.', 'Objectif de 15 % maximum ; le curseur permet de tester plusieurs scénarios.']] },
  { n: 'Priorités et score de risque', items: [
    ['Score de risque', 'KPI-11', 'Combiner plusieurs signaux en un score unique par dossier.', 'Points de retard + points de criticité + bonus d\'échéance proche (détail ci-dessous).', 'Plus le score est élevé, plus le dossier doit être traité en priorité.'],
    ['Catégorie de priorité', 'KPI-11', 'Classer chaque dossier en quatre niveaux.', 'Critique (65 et plus), Élevée (45), Moyenne (25), Faible (en dessous).', 'Alimente la matrice et le classement de la page Priorités.'],
    ['Dossiers à risque imminent et dossiers critiques', 'Complémentaire', 'Anticiper au lieu de seulement constater.', 'Échéance dans les 7 jours ; criticité déclarée « Critique ».', 'Taux de priorité critique comparé à un objectif de 15 %.']] }
];

const VIEWS = [
  { id: 'accueil', name: 'Accueil superviseur', alt: 'Page Accueil superviseur : cartes de volume, de retard, de blocage, d\'âge moyen et de score de risque, jauge de clôture, tableau des dossiers critiques et répartitions par phase et par statut.',
    goal: 'Donner la vision globale du portefeuille dès l\'ouverture.',
    kpis: ['Cartes : total, en cours, taux de retard, taux de blocage, âge moyen, score de risque moyen', 'Jauge du taux de clôture face à l\'objectif de 50 %', 'Tableau des dossiers triés par score de risque', 'Répartitions par phase et par statut ; filtres type, région, date cible'],
    learn: 'Les alertes globales et la phase où le flux se concentre, avant de creuser une page précise.' },
  { id: 'retards', name: 'Délais et Retards', alt: 'Page Délais et Retards : cartes d\'indicateurs de retard, liste des dossiers avec libellé de délai, classement des régions, jauge du taux de retard et boutons de période.',
    goal: 'Suivre les échéances et mesurer l\'ampleur des retards.',
    kpis: ['Nombre et taux de dossiers en retard, retard moyen et maximum', 'Liste des dossiers : criticité, type, libellé de délai', 'Répartition des retards par région', 'Jauge du taux de retard (objectif 15 %), raccourcis de période'],
    learn: 'Quelles régions et quels dossiers concentrent les dépassements, et de combien.' },
  { id: 'blocages', name: 'Blocages', alt: 'Page Blocages : cartes de synthèse, jauge du taux de résolution, liste des blocages avec ancienneté en jours et graphique des types de blocage par état de résolution.',
    goal: 'Suivre les blocages actifs, leur état de résolution et leur ancienneté.',
    kpis: ['Blocages total, actifs, non résolus, taux de non-résolution', 'Jauge du taux de résolution', 'Types de blocage fréquents par état de résolution', 'Liste avec ancienneté en jours ; répartition géographique'],
    learn: 'Les causes récurrentes de blocage et les cas qui traînent depuis le plus longtemps.' },
  { id: 'priorites', name: 'Priorités & Score de risque', alt: 'Page Priorités et Score de risque : cartes, répartition par catégorie, matrice de priorité en nuage de points, score moyen par phase, classement des dossiers prioritaires et jauge de priorité critique.',
    goal: 'Décider quels dossiers traiter en premier.',
    kpis: ['Matrice délai / score de risque, points colorés par catégorie', 'Répartition par catégorie et score moyen par phase', 'Top des dossiers prioritaires', 'Jauge du taux de priorité critique (objectif 15 %)'],
    learn: 'Les dossiers à score élevé et en dépassement, situés en haut à gauche de la matrice.' },
  { id: 'charge', name: 'Charge par Intervenant', alt: 'Page Charge par Intervenant : cartes de synthèse, charge individuelle avec seuil, charge moyenne par rôle, charge pondérée, matrice intervenant par phase, jauge de surcharge et curseur de seuil.',
    goal: 'Arbitrer la répartition du travail entre les intervenants.',
    kpis: ['Charge individuelle et seuil de charge maximal réglable', 'Charge moyenne par rôle et charge pondérée par phase', 'Matrice intervenant × phase', 'Nombre et taux d\'intervenants en surcharge'],
    learn: 'Qui est au-dessus du seuil, et si la charge est concentrée sur une phase ou répartie.' },
  { id: 'fiche', name: 'Fiche Dossier', alt: 'Page Fiche Dossier : identité du dossier, intervenant affecté, historique des événements, message sans blocage actif et, à droite, libellé de délai, type, client, criticité, score de risque et priorité.',
    goal: 'Détailler un dossier unique, accessible par exploration (drill-through).',
    kpis: ['Identité : code, statut, phase, région, dates de création et cible', 'Intervenants et rôle d\'affectation', 'Historique des événements et blocages associés', 'Type, client/projet, criticité, score de risque, priorité'],
    learn: 'Tout ce que l\'on sait d\'un dossier, pour préparer un point de suivi avec l\'intervenant.' }
];
const MODEL = { id: 'modele', name: 'Schéma relationnel du modèle Power BI', alt: 'Schéma relationnel du modèle Power BI.' };
const MODEL_ALT = document.querySelector('[data-open="modele"] img').alt;

/* ---------- Utilitaires ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
$('#sv-year').textContent = new Date().getFullYear();

/* Onglets accessibles (flèches, Home, End) */
function tabs(host, panel, items, label, render, sub) {
  const btns = items.map((it, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'sv-tab'; b.setAttribute('role', 'tab');
    b.id = host.id + '-' + i; b.innerHTML = esc(label(it)) + (sub ? '<small>' + esc(sub(it)) + '</small>' : '');
    host.appendChild(b); return b;
  });
  const select = (i, focus) => {
    btns.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    panel.setAttribute('aria-labelledby', btns[i].id);
    panel.innerHTML = render(items[i], i);
    panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = '';
    if (focus) btns[i].focus();
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => select(i));
    b.addEventListener('keydown', e => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); select((i + k + btns.length) % btns.length, true); }
      else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      else if (e.key === 'End') { e.preventDefault(); select(btns.length - 1, true); }
    });
  });
  select(0);
}

/* ---------- Menu mobile et lien actif ---------- */
const toggle = document.querySelector('.sv-nav__toggle'), menu = $('#sv-menu');
const setMenu = o => { menu.classList.toggle('is-open', o); toggle.setAttribute('aria-expanded', String(o)); toggle.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu'); };
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
const links = [...menu.querySelectorAll('a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll('.sv-axes article,.sv-time li,.sv-goals li,.sv-lp article,.sv-skills>div').forEach(c => { c.classList.add('sv-reveal'); io.observe(c); });
  }
}

/* ---------- Tables ---------- */
tabs($('#sv-tbl-tabs'), $('#sv-tbl-panel'), TABLES, t => t.n, (t) =>
  `<h3>${esc(t.n)}</h3><p class="sv-role">${esc(t.role)}</p><div class="sv-scroll"><table><caption class="sv-vh">Colonnes de ${esc(t.n)}</caption><thead><tr><th>Colonne</th><th>Type</th><th>Clé</th></tr></thead><tbody>${
    t.cols.map(c => `<tr><td><code>${esc(c[0])}</code></td><td>${esc(c[1])}</td><td>${c[2] ? `<span class="sv-key${c[2].includes('FK') && !c[2].startsWith('PK') ? ' sv-key--fk' : ''}">${esc(c[2])}</span>` : ''}</td></tr>`).join('')
  }</tbody></table></div>`, t => t.g);

/* ---------- KPI ---------- */
tabs($('#sv-kpi-tabs'), $('#sv-kpi-panel'), KPIS, k => k.n, k =>
  `<h3>${esc(k.n)}</h3><div class="sv-kpi__list">${k.items.map(i =>
    `<div class="sv-kpi__item"><h4>${esc(i[0])}<em>${esc(i[1])}</em></h4><dl><dt>Finalité</dt><dd>${esc(i[2])}</dd><dt>Calcul</dt><dd>${esc(i[3])}</dd><dt>Lecture</dt><dd>${esc(i[4])}</dd></dl></div>`).join('')}</div>`);

/* Simulateur : règles identiques à la mesure « Score de risque » */
const sLate = $('#sv-s-late'), sCrit = $('#sv-s-crit'), sSoon = $('#sv-s-soon');
function sim() {
  const late = +sLate.value;
  sSoon.disabled = late > 0; if (late > 0) sSoon.checked = false;
  const score = late + +sCrit.value + (sSoon.checked ? 15 : 0);
  $('#sv-s-score').textContent = score;
  $('#sv-s-cat').textContent = score >= 65 ? 'Critique' : score >= 45 ? 'Élevée' : score >= 25 ? 'Moyenne' : 'Faible';
}
[sLate, sCrit, sSoon].forEach(el => el.addEventListener('change', sim)); sim();

/* ---------- Galerie + visionneuse ---------- */
const img = v => `assets/img/${v}.png`;
const thumb = v => `assets/img/${v}.png`;
tabs($('#sv-g-tabs'), $('#sv-g-panel'), VIEWS, v => v.name, (v, i) =>
  `<div class="sv-gpanel__grid"><div><button type="button" class="sv-zoom" data-open="${v.id}" aria-label="Afficher la capture « ${esc(v.name)} » en grand"><img src="${thumb(v.id)}" srcset="${thumb(v.id)} 640w, ${img(v.id)} 1260w" sizes="(max-width:900px) 90vw, 560px" width="1260" height="702" alt="${esc(v.alt)}"><span class="sv-zoom__hint">Agrandir</span></button></div>
  <div><h3>${i + 1}. ${esc(v.name)}</h3><p>${esc(v.goal)}</p><h4>Indicateurs et visualisations</h4><ul>${v.kpis.map(k => `<li>${esc(k)}</li>`).join('')}</ul><h4>Ce que le superviseur comprend</h4><p>${esc(v.learn)}</p><button type="button" class="sv-btn sv-btn--sm" data-open="${v.id}">Afficher en grand</button></div></div>`);

const dlg = $('#sv-viewer'), vImg = $('#sv-v-img'), stage = $('#sv-v-stage'), sizeBtn = $('#sv-v-size');
const SET = [...VIEWS.map(v => ({ id: v.id, name: v.name, alt: v.alt })), { id: 'modele', name: MODEL.name, alt: MODEL_ALT }];
let cur = 0;
function show(i) {
  cur = (i + SET.length) % SET.length; const it = SET[cur];
  vImg.src = img(it.id); vImg.alt = it.alt;
  $('#sv-v-cap').textContent = `${it.name} (${cur + 1}/${SET.length})`;
  setFull(false);
}
function setFull(f) { stage.classList.toggle('is-full', f); sizeBtn.setAttribute('aria-pressed', String(f)); sizeBtn.textContent = f ? 'Ajuster à l\'écran' : 'Taille réelle'; }
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o) { show(SET.findIndex(s => s.id === o.dataset.open)); dlg.showModal(); }
});
$('#sv-v-close').addEventListener('click', () => dlg.close());
$('#sv-v-prev').addEventListener('click', () => show(cur - 1));
$('#sv-v-next').addEventListener('click', () => show(cur + 1));
sizeBtn.addEventListener('click', () => setFull(!stage.classList.contains('is-full')));
vImg.addEventListener('click', () => setFull(!stage.classList.contains('is-full')));
dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* ---------- Documents ---------- */
const cats = ['Tous', ...new Set(DOCS.map(d => d.cat))];
const chips = $('#sv-d-chips'), grid = $('#sv-docs');
function drawDocs(cat) {
  chips.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.textContent === cat)));
  grid.innerHTML = DOCS.filter(d => cat === 'Tous' || d.cat === cat).map(d => {
    const action = d.file
      ? `<a class="sv-btn sv-btn--sm" href="${esc(d.file)}" target="_blank" rel="noopener noreferrer"${d.type === 'PDF' ? '' : ' download'}>${d.type === 'PDF' ? 'Consulter' : 'Télécharger'}</a>`
      : '<p class="sv-doc__off">Non publié en ligne</p>';
    return `<article class="sv-doc"><div class="sv-doc__top"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[d.icon]}</svg><div><span class="sv-doc__type">${esc(d.type)} · ${esc(d.cat)}</span></div></div><h3>${esc(d.title)}</h3><p>${esc(d.desc)}</p>${action}</article>`;
  }).join('');
}
cats.forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.className = 'sv-chip'; b.textContent = c; b.addEventListener('click', () => drawDocs(c)); chips.appendChild(b); });
drawDocs('Tous');
