'use strict';
const FORM_ENDPOINT = 'https://formspree.io/f/xwllearn';

document.getElementById('year').textContent = new Date().getFullYear();

/* Menu mobile */
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
const setMenu = open => {
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
};
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* Lien actif pendant le défilement */
const links = [...menu.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

/* Apparition des cartes */
const cards = document.querySelectorAll('.card, .skill, .timeline li');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  cards.forEach(c => { c.classList.add('reveal'); io.observe(c); });
}

/* Captures manquantes : on garde le visuel de repli */
document.querySelectorAll('.thumb img').forEach(img => {
  img.addEventListener('error', () => img.remove());
});

/* Formulaire */
const form = document.getElementById('form');
const status = document.getElementById('status');
const say = (msg, type) => { status.textContent = msg; status.className = 'form__status ' + type; };

form.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
    f.setAttribute('aria-invalid', String(bad));
    if (bad && ok) { f.focus(); ok = false; }
  });
  if (!ok) return say('Veuillez remplir tous les champs avec une adresse e-mail valide.', 'err');
  if (form.elements._gotcha.value) return;
  
  if (FORM_ENDPOINT.includes('VOTRE_ID')) {return say("Le formulaire n'est pas encore configuré. Écrivez-moi directement par e-mail.", 'err');}

  const btn = form.querySelector('button');
  btn.disabled = true; say('Envoi en cours…', '');
  try {
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
    if (!res.ok) throw new Error(res.status);
    form.reset(); say('Message envoyé. Merci, je vous réponds rapidement.', 'ok');
  } catch (err) {
    say("Le message n'a pas pu être envoyé. Réessayez ou écrivez-moi à hiba.kourda.2025@ihec.ucar.tn.", 'err');
  } finally { btn.disabled = false; }
});
