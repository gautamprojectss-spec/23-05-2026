/*
  Colours & Patterns Website Form Handler

  Use this file in Google Apps Script.
  It saves website form details into a Google Sheet in your Google Drive.

  Setup:
  1. Create a Google Sheet in Google Drive.
  2. Copy the Sheet ID from the URL.
     Example:
     https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
  3. Paste that ID into SPREADSHEET_ID below.
  4. In Apps Script, deploy as Web App.
  5. Copy the Web App URL into lets-talk.html:
     data-apps-script-url="YOUR_WEB_APP_URL"
*/

const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Website Form Leads";
const TEAM_EMAIL = "isha@coloursandpatterns.in";
const WHATSAPP_NUMBER = "+91 79804 36369";

function doGet() {
  return createJsonResponse({
    ok: true,
    message: "Colours & Patterns form app script is working."
  });
}

function doPost(e) {
  try {
    const data = getFormData(e);
    const sheet = getSheet();

    addHeadersIfNeeded(sheet);
    sheet.appendRow([
      new Date(),
      data.name,
      data.company,
      data.email,
      data.phone,
      data.city,
      data.industry,
      data.services,
      data.message,
      data.referral,
      data.sourcePage,
      data.userAgent
    ]);

    sendTeamEmail(data);
    sendUserAutoReply(data);

    return createJsonResponse({
      ok: true,
      message: "Form submitted successfully."
    });
  } catch (error) {
    return createJsonResponse({
      ok: false,
      message: error.message
    });
  }
}

function getFormData(e) {
  const params = e && e.parameter ? e.parameter : {};
  const multiParams = e && e.parameters ? e.parameters : {};

  const selectedServices = multiParams.services
    ? multiParams.services.join(", ")
    : clean(params.services);

  return {
    name: clean(params.name),
    company: clean(params.company),
    email: clean(params.email),
    phone: clean(params.phone),
    city: clean(params.city),
    industry: clean(params.industry),
    services: selectedServices,
    message: clean(params.message),
    referral: clean(params.referral),
    sourcePage: clean(params.sourcePage),
    userAgent: clean(params.userAgent)
  };
}

function getSheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    throw new Error("Please paste your Google Sheet ID into SPREADSHEET_ID.");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function addHeadersIfNeeded(sheet) {
  const headers = [
    "Timestamp",
    "Full Name",
    "Business / Company",
    "Email Address",
    "Phone / WhatsApp",
    "City / Location",
    "Industry",
    "Services of Interest",
    "Project Brief",
    "How They Heard About Us",
    "Source Page",
    "User Agent"
  ];

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = currentHeaders.some(function (value) {
    return value !== "";
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function sendTeamEmail(data) {
  const subject = "New Website Inquiry - " + (data.company || data.name || "Colours & Patterns");

  const body = [
    "New website form inquiry received.",
    "",
    "Full Name: " + data.name,
    "Business / Company: " + data.company,
    "Email Address: " + data.email,
    "Phone / WhatsApp: " + data.phone,
    "City / Location: " + data.city,
    "Industry: " + data.industry,
    "Services of Interest: " + data.services,
    "How They Heard About Us: " + data.referral,
    "Source Page: " + data.sourcePage,
    "",
    "Project Brief:",
    data.message || "Not shared"
  ].join("\n");

  MailApp.sendEmail({
    to: TEAM_EMAIL,
    subject: subject,
    body: body,
    replyTo: data.email || TEAM_EMAIL,
    name: "Colours & Patterns Website"
  });
}

function sendUserAutoReply(data) {
  if (!data.email) return;

  const subject = "We received your inquiry - Colours & Patterns";

  const body = [
    "Hi " + (data.name || "there") + ",",
    "",
    "Thank you for reaching out to Colours & Patterns.",
    "We have received your inquiry and will respond within one business day.",
    "",
    "Your inquiry summary:",
    "Business / Company: " + (data.company || "Not shared"),
    "City / Location: " + (data.city || "Not shared"),
    "Services of Interest: " + (data.services || "Not selected"),
    "",
    "If this is urgent, you can WhatsApp us at " + WHATSAPP_NUMBER + ".",
    "",
    "Regards,",
    "Colours & Patterns"
  ].join("\n");

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    name: "Colours & Patterns"
  });
}

function clean(value) {
  return String(value || "").trim();
}

function createJsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
