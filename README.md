# Willa & John — Wedding Invitation Website

## Included
- Responsive PC + mobile wedding invitation
- Animated/floating envelope opening screen
- Clickable envelope / wax-seal prompt
- Willa & John — November 1, 2026
- Scrollable wedding details and dress code
- RSVP modal
- Guest count, guest names, meal preference and message
- Automatic RSVP deadline: **October 1, 2026 at 11:59 PM (Philippines time)**
- Automatic closed RSVP state after the deadline
- Google Sheets backend template for live RSVP collection
- Google Sheets can be downloaded as Excel (.xlsx)

## Quick preview
Open `index.html` in a browser.

## Connect the live RSVP spreadsheet
1. Create a Google Sheet.
2. Open **Extensions -> Apps Script**.
3. Paste `google-apps-script.gs`.
4. Deploy it as a **Web app** that executes as you and is accessible to anyone.
5. Copy the deployed `/exec` URL.
6. Open `app.js` and replace:
   `const RSVP_ENDPOINT = "";`
   with:
   `const RSVP_ENDPOINT = "YOUR_WEB_APP_EXEC_URL";`
7. Publish the website again.

The Google Sheet will receive one row per RSVP in real time.

## Replace placeholders
In `index.html`, replace:
- `Venue Name`
- `Complete venue address`
- `Reception Venue`
- `Complete venue address`
- Ceremony/reception times if different
- Google Maps links

## Important
The current envelope artwork is the image supplied in the conversation. The current image already contains the blush WL seal, so the opening screen animates the envelope/seal as a single invitation object. If you want the seal to be a truly separate moving layer, use a clean envelope image without the printed seal and place the separate transparent WL seal PNG over it.

## RSVP deadline
Change this line in `app.js` if needed:
`const RSVP_DEADLINE = new Date("2026-10-01T23:59:59+08:00");`
