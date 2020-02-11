/**
 * lcr_run.js
 * Main JavaScript code that is run when the "Generate" button is clicked
 */

function run_lcr() {
  /*     =====  <Setup>  ======     */

  let importedDates = importDates();

  // Lunar calendar date:
  let lunarMonth = importedDates[0];
  let lunarDay = importedDates[1];
  let lunarLeap = importedDates[2];

  // Not sure if isee15's converter is limited to years 1900 to 2100 but we'll limit anyway
  let startYear = importedDates[3]; // Year to start generating event reminders (inclusive)
  let endYear = importedDates[4]; // Year to stop generating event reminders (inclusive)

  // Event Details:
  // For more info, see: https://support.google.com/calendar/answer/37118
  let eventDetails = importEventDetails();
  /**
  Sample Values:
      [index]         [example]                 [what it is]     -  [description]
      ======================================================================================================
      [not in array]  ---------                 Start Date       - The first day of the event, required
      [0]             "Chinese New Year"        Subject          - The name of the event, required
      [1]             "10:00 AM"                Start Time       - The time the event begins. Unnecessary if an 'All Day Event'
      [2]             "1:00 PM"                 End Time         - The time the event ends. Unnecessary if an 'All Day Event'
      [3]             "True"                    All Day Event    - Whether the event is an all-day event. Enter `True` if it is an all-day event, and `False` if it isn't
      [4]             "New year celebration!"   Description      - Description or notes about the event. Do not use a comma in the description
      [5]             "Grandma's House"         Location         - The location for the event
      [6]             "True"                    Private          - Whether the event should be marked private. Enter `True` if the event is private, and `False` if it isn't
      [7]             0                         Event Length     - Number of days the event lasts (after the start date). Enter `0` if the event is only for that one day. (Note this is different than the HTML form side)
  */

  /*     =====  </Setup>  =====     */

  /* =============== Program Code =============== */

  let convertedDates = solarToLunarRange(
    lunarMonth,
    lunarDay,
    lunarLeap,
    startYear,
    endYear
  );

  let filetype = document.getElementById("lunarForm").elements.fileType.value;

  // Take event subject and replace all non-alphanumeric with an underscore
  // https://stackoverflow.com/a/8485137
  let title = eventDetails[0].replace(/[^a-z0-9]/gi, "_").toLowerCase();

  let fileName = title + "_calendar_reminder." + filetype;
  let fileContents;

  switch (filetype) {
    case "csv":
      fileContents = generateCSV(eventDetails, convertedDates);
      downloadFile(fileName, fileContents);
      break;
    case "ical":
      fileContents = "iCal not supported yet.";
      alert(`iCal not supported yet`);
      break;
    default:
      //unknown filetype
      fileContents = `Error, unknown filetype (${filetype}) selected.`;
      alert(`Error, unknown filetype (${filetype}) selected.`);
  }

}
