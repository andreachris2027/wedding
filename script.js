const cover = document.querySelector('#cover');
const invitation = document.querySelector('#invitation');
document.querySelector('#open-invitation').addEventListener('click', () => {
  if (cover.classList.contains('opening')) return;
  cover.classList.add('opening');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => {
    invitation.classList.add('visible');
    invitation.focus({ preventScroll: true });
    invitation.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
  }, reducedMotion ? 50 : 1150);
});
