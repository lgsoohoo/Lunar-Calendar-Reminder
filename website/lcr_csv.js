function generateCSV(eventDetails, solarDates) {
  let csvContents = generateCSVHeader() + "\n";

  for (var i = 0; i < solarDates.length; i++) {
    csvContents += generateCSVLine(solarDates[i], eventDetails) + "\n";
  }

  return csvContents;
}

// Generate one line of CSV data
function generateCSVLine(date, details) {
  let datePretty = `${date.solarMonth}/${date.solarDay}/${date.solarYear}`;
  let csvLine = datePretty;

  for (let i = 0; i < details.length - 1; i++) {
    csvLine += ", " + details[i];
  }

  /* If the event is longer than one day
   * Then calculate end date
   * Else use the start date   */
  let eventLength = details[7];
  if (eventLength>0) {

    // Generate the end date    
    // https://stackoverflow.com/a/3674550
    let endDay = new Date(datePretty);
    endDay.setDate(endDay.getDate() + eventLength);

    // Add the end date to csvLine
    csvLine += ", " + `${endDay.getMonth()+1}/${endDay.getDate()}/${endDay.getFullYear()}`;
  }
  else{
    csvLine += ", " + datePretty;
  }

  return csvLine;
}

// Generate the CSV header
function generateCSVHeader() {
  return "Start Date, Subject, Start Time, End Time, All Day Event, Description, Location, Private, End Date";

  // We could program it based on the `headerFields` array,
  // but hard-coding is more efficient since we have to type
  // it in here anyway
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
