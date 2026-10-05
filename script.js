const cover = document.querySelector('#cover');
const invitation = document.querySelector('#invitation');
document.querySelector('#open-invitation').addEventListener('click', () => {
  if (cover.classList.contains('opening')) return;
  cover.classList.add('opening');
  window.setTimeout(() => {
    invitation.classList.add('visible');
    invitation.focus({ preventScroll: true });
    invitation.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, 850);
});
