# Colours & Patterns Form Apps Script

This script receives the Let's Talk form, saves each inquiry to Google Sheets, emails the team, and sends an auto-reply to the user.

## Setup

1. Create a Google Sheet for leads.
2. Open Extensions > Apps Script.
3. Paste `Code.gs` into the Apps Script editor.
4. In `CONFIG`, either leave `SPREADSHEET_ID` blank if the script is bound to the lead sheet, or paste the spreadsheet ID.
5. Confirm `TEAM_EMAIL` is correct.
6. Deploy > New deployment > Web app.
7. Set "Execute as" to your account.
8. Set "Who has access" to "Anyone".
9. Copy the Web app URL.
10. In `lets-talk.html`, replace `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` in `data-apps-script-url` with the Web app URL.

The website form will fall back to opening an email draft until the Apps Script URL is added.
