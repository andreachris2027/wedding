const SPREADSHEET_ID = '1_Wk_ZeHZ0H3Q2ucGmBf4H6If-ApIRZQp9jvup-4aavc';
const RESPONSE_SHEET_NAME = 'RSVP Responses';
const HEADERS = ['First Name', 'Last Name', 'RSVP', 'Appetizer', 'Main', 'Dessert', 'Submitted At'];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents);
    const firstName = cleanName(data.firstName);
    const lastName = cleanName(data.lastName);
    const attendance = String(data.attendance || '');

    if (!firstName || !lastName) throw new Error('First and last name are required.');
    if (!['Attending', 'Not attending'].includes(attendance)) throw new Error('Invalid RSVP selection.');

    const food = attendance === 'Attending'
      ? {
          appetizer: String(data.appetizer || ''),
          main: String(data.main || ''),
          dessert: String(data.dessert || '')
        }
      : { appetizer: '', main: '', dessert: '' };

    if (attendance === 'Attending') {
      if (!['Chestnut Soup', 'Balsamic and Walnut Salad'].includes(food.appetizer)) throw new Error('Invalid appetizer.');
      if (!['Beef', 'Chicken'].includes(food.main)) throw new Error('Invalid main.');
      if (!['Sticky Toffee Pudding Cake', 'Strawberry Gin Cheesecake'].includes(food.dessert)) throw new Error('Invalid dessert.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = spreadsheet.getSheetByName(RESPONSE_SHEET_NAME) || spreadsheet.insertSheet(RESPONSE_SHEET_NAME);
      initializeHeaders(sheet);
      sheet.appendRow([
        firstName,
        lastName,
        attendance,
        food.appetizer,
        food.main,
        food.dessert,
        new Date()
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error.message || error) });
  }
}

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 80);
}

function initializeHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }

  const current = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (HEADERS.some((header, index) => current[index] !== header)) {
    throw new Error(`The first row in “${RESPONSE_SHEET_NAME}” must contain the expected RSVP headers.`);
  }
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
