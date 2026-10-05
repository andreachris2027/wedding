# Wedding invitation site

A small static site ready for GitHub Pages. Open `index.html` locally to preview it. The candlelit reception photo is in `assets/candlelit-table.png`.

## RSVP spreadsheet setup

The RSVP form collects first name, last name, attendance, and (for attending guests) appetizer, main, and dessert selections. `google-apps-script/Code.gs` appends these as separate columns in an `RSVP Responses` tab in the linked spreadsheet, including a submission timestamp.

To connect it:

1. Open the spreadsheet and choose **Extensions → Apps Script**.
2. Replace the starter code with the contents of `google-apps-script/Code.gs` and save it.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as** to your account and **Who has access** to **Anyone**, then deploy and authorize access to the spreadsheet.
4. Copy the web app URL ending in `/exec` into `RSVP_ENDPOINT` near the top of `script.js`.
5. Publish the updated website. The first submission creates the `RSVP Responses` tab with headers; each later RSVP adds a row.

The Google Drive/Sheets connector is disabled in this workspace, so the sheet and Apps Script deployment need to be connected by the spreadsheet owner. Until the web app URL is added, the RSVP form displays that collection is not connected.

## Publish with GitHub Pages

Push this folder to a GitHub repository, then in the repository choose **Settings → Pages** and deploy from the `main` branch and `/ (root)` folder. GitHub Pages will publish the site at `https://<username>.github.io/<repository>/` (or at the account root for a repository named `<username>.github.io`).
# wedding_website
