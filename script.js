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

// Deploy the Google Apps Script in google-apps-script/Code.gs and paste its
// Web App URL here to send RSVPs to the linked spreadsheet.
const RSVP_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
const rsvpForm = document.querySelector('#rsvp-form');
const attendance = document.querySelector('#attendance');
const foodChoices = document.querySelector('#food-choices');
const foodFields = [...foodChoices.querySelectorAll('select')];
const formNote = document.querySelector('#form-note');
const submitButton = rsvpForm.querySelector('[type="submit"]');
if (RSVP_ENDPOINT.startsWith('PASTE_')) {
  formNote.textContent = 'RSVP collection is being set up. Please try again soon.';
}

function updateFoodChoices() {
  const attending = attendance.value === 'Attending';
  foodChoices.hidden = !attending;
  foodFields.forEach(field => {
    field.required = attending;
    field.disabled = !attending;
    if (!attending) field.value = '';
  });
}

attendance.addEventListener('change', updateFoodChoices);
updateFoodChoices();

rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (rsvpForm.elements.website.value) return;
  if (!rsvpForm.reportValidity()) return;
  if (RSVP_ENDPOINT.startsWith('PASTE_')) {
    formNote.textContent = 'The RSVP form is not connected to the guest list yet. Please try again later.';
    return;
  }

  const fields = new FormData(rsvpForm);
  const response = {
    firstName: String(fields.get('firstName')).trim(),
    lastName: String(fields.get('lastName')).trim(),
    attendance: fields.get('attendance'),
    appetizer: fields.get('appetizer') || '',
    main: fields.get('main') || '',
    dessert: fields.get('dessert') || ''
  };

  submitButton.disabled = true;
  formNote.textContent = 'Sending your reply…';
  try {
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(response)
    });
    rsvpForm.reset();
    updateFoodChoices();
    formNote.textContent = 'Thank you! Your RSVP has been sent.';
    window.setTimeout(() => dialog.close(), 1600);
  } catch {
    formNote.textContent = 'We couldn’t send your RSVP. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});
