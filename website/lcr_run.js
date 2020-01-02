function lcr_run_go() {
  /*     =====  <Setup>  ======     */

  let importedDates = importDates();

  // Lunar calendar date:
  let lunarMonth = importedDates[0];
  let lunarDay = importedDates[1];
  let lunarLeap = importedDates[2];

  // Note: This program is limited to years 1900 to 2100
  // Not sure if this note is still true since we're now using isee15's converter
  let startYear = importedDates[3]; // Year to start generating event reminders (inclusive)
  let endYear = importedDates[4]; // Year to stop generating event reminders (inclusive)

  // Event Details:
  // For more info, see: https://support.google.com/calendar/answer/37118
  let eventDetails = importEventDetails();
  // Sample Values:
  //        // {not in the array} Start Date - The first day of the event, required. Example: 05/30/2020
  //   [0]  "", // Subject - The name of the event, required. Example: Chinese New Year
  //   [1]  "", // Start Time - The time the event begins. Unnecessary if an 'All Day Event'. Example: 10:00 AM
  //   [2]  "", // End Time - The time the event ends. Unnecessary if an 'All Day Event'. Example: 1:00 PM
  //   [3]  "", // All Day Event - Whether the event is an all-day event. Enter `True` if it is an all-day event, and `False` if it isn't.
  //   [4]  ``, // Description - Description or notes about the event. Don't write the end year in the description. Example: 50 multiple choice questions and two essay questions
  //   [5]  "", // Location - The location for the event. Example: "Columbia, Schermerhorn 614"
  //   [6]  "", // Private - Whether the event should be marked private. Enter `True` if the event is private, and `False` if it isn't.
  //   [7]  0 // Event Length - Number of days the event lasts (after the start date). Enter `0` if the event is only for that one day.

  /*     =====  </Setup>  =====     */

  // Program Code ========================================

  let convertedDates = solarToLunarRange(
    lunarMonth,
    lunarDay,
    lunarLeap,
    startYear,
    endYear
  );

  let filetype = document.getElementById("lunarForm").elements.fileType.value;

  let fileName =
    "lunarReminder_" + lunarMonth + "_" + lunarDay + "." + filetype;
  let fileContents;

  switch (filetype) {
    case "csv":
      fileContents = generateCSV(eventDetails, convertedDates);
      break;
    case "ical":
      fileContents = "iCal not supported yet.";
      break;
    default:
      //unknown filetype
      fileContents = `Error, unknown filetype (${filetype}) selected.`;
  }

  downloadFile(fileName, fileContents);
}
