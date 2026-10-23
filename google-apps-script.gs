/*
  WILLA & RICARDO — RSVP BACKEND
  Google Apps Script

  1. Create a Google Sheet.
  2. Extensions -> Apps Script.
  3. Paste this file into Code.gs.
  4. Change SHEET_NAME if needed.
  5. Deploy -> New deployment -> Web app.
     Execute as: Me
     Who has access: Anyone
  6. Copy the /exec URL into RSVP_ENDPOINT in app.js.

  The sheet becomes your live RSVP ledger and can be downloaded as Excel:
  File -> Download -> Microsoft Excel (.xlsx)
*/

const SHEET_NAME = "RSVPs";

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Name", "Attending", "Guests",
      "Guest Names", "Meal Preference", "Message"
    ]);
    sheet.setFrozenRows(1);
  }
}

function doGet() {
  setup();
  return ContentService.createTextOutput("Willa & John RSVP endpoint is ready.");
}

function doPost(e) {
  setup();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.attending || "",
    Number(data.guests || 0),
    data.guestNames || "",
    data.meal || "",
    data.message || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}
