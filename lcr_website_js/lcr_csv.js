/**
 * lcr_csv.js
 * This file contains functions for converting Solar dates into a CSV file
 */

/**
 * Generates the contents of the CSV file
 * 
 * @param {Array containing details about the event. Specified in the setup section of 'lcr_run.js'} eventDetails 
 * @param {Array containing the (converted) Gregorian Calendar dates} solarDates 
 * 
 * @returns {String containing the contents of the CSV file}
 */
function generateCSV(eventDetails, solarDates) {
  let csvContents = generateCSVHeader() + "\n";

  for (var i = 0; i < solarDates.length; i++) {
    csvContents += generateCSVLine(solarDates[i], eventDetails) + "\n";
  }

  return csvContents;
}

/**
 * Generates one line of CSV data
 * 
 * @param {A single Gregorian date} date 
 * @param {Array containing details about the event. Specified in the setup section of 'lcr_run.js'} details 
 * 
 * @returns {String containing one line of the CSV data}
 */
function generateCSVLine(date, details) {
  //Copy the start date
  let datePretty = `${date.solarMonth}/${date.solarDay}/${date.solarYear}`;
  let csvLine = datePretty;

  //Copy event details
  for (let i = 0; i < details.length - 1; i++) {
    csvLine += ", " + details[i];
  }

  /* Figure out the end date
   * 
   * If: the event is longer than one day
   * Then: calculate end date
   * Else: use the start date   */
  let eventLength = details[7];
  if (eventLength>0) {
    // Generate the new end date      
    let endDay = new Date(datePretty);
    endDay.setDate(endDay.getDate() + eventLength);
    // https://stackoverflow.com/a/3674550

    // Add the end date to csvLine
    csvLine += ", " + `${endDay.getMonth()+1}/${endDay.getDate()}/${endDay.getFullYear()}`;
  }
  else{
    //Event ends the same day so use the start date as the end date
    csvLine += ", " + datePretty;
  }

  return csvLine;
}

/**
 * Generates the CSV header text
 * 
 * @returns {String containing the CSV header text}
 */
function generateCSVHeader() {
  return "Start Date, Subject, Start Time, End Time, All Day Event, Description, Location, Private, End Date";

  /**
   * We could generate it based on the `headerFields` (below) array,
   * but hard-coding is more efficient since we have to type
   * it in here anyway and the header shouldn't really change
   */

  /*
    // Names of headers
    let headerFields = [
        "Start Date",
        "Subject",
        "Start Time",
        "End Time",
        "All Day Event",
        "Description",
        "Location",
        "Private",
        "End Date"
    ];

    let returnHeader = headerFields[0];

    for (let i = 1; i < usingFields.length; i++) {
        returnHeader += ", " + headerFields[i];
    }

    return returnHeader;
  */
}
