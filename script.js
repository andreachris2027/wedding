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

const dialog = document.querySelector('#rsvp-dialog');
document.querySelector('#rsvp-open').addEventListener('click', () => dialog.showModal());
document.querySelector('#rsvp-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

document.querySelector('#rsvp-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent('Wedding RSVP — ' + form.get('name'));
  const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\nReply: ${form.get('attendance')}\nGuests: ${form.get('guests')}`);
  // Replace this address with the couple's preferred RSVP email.
  window.location.href = `mailto:rsvp@example.com?subject=${subject}&body=${body}`;
});
