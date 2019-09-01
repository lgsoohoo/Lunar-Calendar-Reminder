/*

    Lunar Calendar Reminder (JavaScript)
    Lucas Soohoo, August 2019

    "Lunar Calendar Reminder" allows you to create Google Calendar events for
    a specific Lunar calendar date. For example, you can enter in a friend or
    family member's Lunar calendar birthday, and have Google Calendar remind you
    on the equivalent Gregorian calendar date.

    This JavaScript code can be run in your browser and will print out the data
    in the console, which can be copy-pasted into a CSV file and imported into
    Google Calendar.

    To use this program:
    1. Edit the program parameters in the <Setup></Setup> section
    2. Open a web browser and go to:
        https://pteo.paranoiaworks.mobi/chinese_calendar/
        a. This is required as CORS will block the HTTP requests if you are on
           a different page.
    3. Open the web browser console and copy-paste the code
        a. You may be required to allow pasting into the console
        b. If you receive a redeclaration error or you are running the code
        multiple times, paste the code between two braces { } before running
    5. Copy the console output into a text editor and save as a ".csv" file
    6. Open Google Calendar and import the CSV file into your calendar

    This is the JAVASCRIPT version of the "Lunar Calendar Reminder" program.
    You can run this code online at <site coming soon>. If you are writing a
    script to automate this program, you may consider downloading and running
    the PYTHON version of this program. <Python version also coming soon.>

    Note: "Lunar Calendar Reminder" is limited to years 1900-2100 because this
    program relies on the 'Paranoia Works' online converter
    (https://pteo.paranoiaworks.mobi/chinese_calendar/)
    to preform Lunar to Gregorian conversions. "Lunar Calendar Reminder" and its
    creator is not affiliated, endorsed or sponsored by 'Paranoia Works'.

*/


/*     =====  <Setup>  ======     */
// Lunar calendar date:
let lunarMonth = 1;
let lunarDay = 1;

// Note: This program is limited to years 1900 to 2100
let startYear = 2019; // Year to start generating event reminders (inclusive)
let endYear = 2088; // Year to stop generating event reminders (inclusive)

// Event Details:
// For more info, see: https://support.google.com/calendar/answer/37118
let eventDetails = [
    "Chinese New Year", // Subject - The name of the event, required. Example: Chinese New Year
    // Start Date - The first day of the event, required. Example: 05/30/2020
    "", // Start Time - The time the event begins. Unnecessary if an 'All Day Event'. Example: 10:00 AM
    "", // End Time - The time the event ends. Unnecessary if an 'All Day Event'. Example: 1:00 PM
    "True", // All Day Event - Whether the event is an all-day event. Enter `True` if it is an all-day event, and `False` if it isn't.
    `Lunar Calendar: ${lunarMonth}/${lunarDay} converted to Gregorian`,
    // Description - Description or notes about the event. Don't write the end year in the description. Example: 50 multiple choice questions and two essay questions
    "", // Location - The location for the event. Example: "Columbia, Schermerhorn 614"
    "True", // Private - Whether the event should be marked private. Enter `True` if the event is private, and `False` if it isn't.
    0, // Event Length - Number of days the event lasts (after the start date). Enter `0` if the event is only for that one day.
];
/*     =====  </Setup>  =====     */

// Program Code ========================================

// Will contain the full CSV file data
var csvFile;

// Never got a 0 response from 'Paranoia Works'. Helps stop HTTP requests if
// errors. See lunarToGregorian() for explanation on 0 HTTP status
var neverZeroStatus = true;

// Number of milliseconds to delay between HTTP requests
let httpDelayLength = 100;

// Remember what event fields we are using
let usingFields = [
    eventDetails[0] !== "",
    // Start Date is always true
    eventDetails[1] !== "",
    eventDetails[2] !== "",
    eventDetails[3] !== "",
    eventDetails[4] !== "",
    eventDetails[5] !== "",
    eventDetails[6] !== "",
    eventDetails[7] !== 0
];


// Generate the CSV header (based on what fields are being used)
function generateHeader() {
    // Names of headers. This array lines up with the `usingFields` array
    let headerFields = [
        "Subject",
        //"Start Date",
        "Start Time",
        "End Time",
        "All Day Event",
        "Description",
        "Location",
        "Private",
        "End Date"
    ];

    let returnHeader = "Start Date"; // CSV will always include the 'Start Date' field

    for (let i = 0; i < usingFields.length; i++) {
        if (usingFields[i]) {
            // Include the header for the field if we are using it
            returnHeader += ", " + headerFields[i];
        }
    }
    return returnHeader;
}


// Generates one line of CSV data (based on what fields are being used)
function generateCSVLine(year, month, day) {
    let csvLine = `${month}/${day}/${year}`; // CSV will always include the 'Start Date' field

    for (let i = 0; i < usingFields.length - 1; i++) {
        // Include the value for the field if we are using it (except for the 'End Date' field)
        if (usingFields[i]) {
            csvLine += ", " + eventDetails[i];
        }
    }

    if (usingFields[usingFields.length - 1]) {
        // If the event is longer than one day:

        // Generate the end date
        // https://stackoverflow.com/a/23081260
        let startDay = new Date(`${month}/${day}/${year}`);
        let endDay = new Date(startDay);

        // Set the end date ahead by the given amount of days
        endDay.setDate(startDay.getDate() + eventDetails[eventDetails.length - 1]);

        let endMonth = endDay.getMonth() + 1; // Months are counted starting at 0

        // Add the end date to csvLine
        csvLine += ", " + `${endMonth}/${endDay.getDate()}/${endDay.getFullYear()}`;
    }

    return csvLine;
}


// Converts a Lunar Calendar date to a Gregorian Calendar date using Paranoia Works' website
function lunarToGregorian(varYear, varMonth, varDay) {
    if (!neverZeroStatus) {
        // Quit if we got a 0 status earlier
        return;
    }

    // Send HTTP requests in a function so the XMLHttpRequest's don't interfere with each other
    let oReq = new XMLHttpRequest();

    let link = "https://pteo.paranoiaworks.mobi/chinese_calendar/cncalprov.php?g2c=0&year=" + varYear + "&month=" + varMonth + "&date=" + varDay + "&leap=0";

    oReq.onreadystatechange = function() {
        if (oReq.readyState == XMLHttpRequest.DONE) {
            if (oReq.status == 500) {
                // Received an error. Server is down (probably) because we sent too many requests too quickly
                // We need to resubmit
                console.log(`Received 500 server error for year: ${varYear}. Resubmitting...`)
                setTimeout(function() {
                    // Add a small delay to allow server to recover
                    oReq.open("GET", link);
                    oReq.send();
                }, httpDelayLength);

            } else if (oReq.status == 0) {
                // Can't reach the 'Paranoia Works' site.
                // Probably because CORS is blocking it. Could also be that the website is down or user does not have internet connection
                neverZeroStatus = false;
                console.log(`Received 0 status for year: ${varYear}.\nEnsure that:\n1. This tab is at the 'Paranoia Works' website\n\thttps://pteo.paranoiaworks.mobi/chinese_calendar/\n2. The 'Paranoia Works' website is up\n3. Your computer is connected to the internet`)
            } else {

                let rawRes = oReq.responseText;
                //Possible response formats:
                // <ERROR>Invalid input date (mm/dd/yyyy)</ERROR>
                // <ROOT><YEAR>2018</YEAR><MONTH>09</MONTH><DAY>08</DAY><LEAP>0</LEAP>...


                // Save to CSV only if valid response/input date
                if (rawRes.includes("Invalid")) {
                    console.log(`${varMonth}/${varDay} is an invalid date for ${varYear}. Skipping...`)
                } else {

                    // Extract the Gregorian Calendar date from the xml
                    // https://stackoverflow.com/a/14867897

                    let startIndex = rawRes.lastIndexOf("<YEAR>") + 6; //+6 so it wont print "YEAR>"
                    let endIndex = rawRes.lastIndexOf("</YEAR>");
                    let gregYear = rawRes.substring(startIndex, endIndex);

                    startIndex = rawRes.lastIndexOf("<MONTH>") + 7;
                    endIndex = rawRes.lastIndexOf("</MONTH>");
                    let gregMonth = rawRes.substring(startIndex, endIndex);

                    startIndex = rawRes.lastIndexOf("<DAY>") + 5;
                    endIndex = rawRes.lastIndexOf("</DAY>");
                    let gregDay = rawRes.substring(startIndex, endIndex);

                    let csvLine = generateCSVLine(gregYear, gregMonth, gregDay);

                    // Add the line to the file. We don't use a return statement
                    // for the function because the HTTP requests are asynchronous
                    csvFile += csvLine + "\n";
                }
            }
        }
    } // end oReq.onreadystatechange = function()...

    oReq.open("GET", link);
    oReq.send();

} // end lunarToGregorian()

// Ensure all HTTP responses have been received before printing
// This works assuming they didn't put the end year in their description
function printCSVFile() {
    if (!csvFile.includes(endYear)) {
        console.log("Waiting for remaining HTTP responses...")
        setTimeout(function() {
            // Try and wait for the remaining HTTP responses
            printCSVFile()
        }, 1500);
    } else {
        console.log(csvFile)
    }

}


// Program Body ========================================

if (startYear < 1900 || endYear > 2100) {
    console.log(`Error: Program is limited to years 1900 to 2100.\nEntered years: ${startYear} to ${endYear}.`);
} else if (startYear > endYear) {
    console.log(`Error: Start Year is after End Year.\nEntered years: ${startYear} to ${endYear}.`);
} else {

    let printCSVDelayLength = (endYear - startYear + 1) * httpDelayLength * 1.25;
    if (printCSVDelayLength < 2000) {
        // delay must be at least 2000ms/2sec
        printCSVDelayLength = 2000;
    }

    console.log(`Program is running. Please wait ${Math.round(printCSVDelayLength/1000)} seconds.`)

    csvFile = generateHeader() + "\n";

    for (let year = startYear; year <= endYear; year++) {
        setTimeout(function() {
            // Small delay so the server won't get overloaded
            lunarToGregorian(year, lunarMonth, lunarDay);
        }, (year - startYear) * httpDelayLength);
        // schedule requests after [0, 0.1, 0.2, 0.3, 0.4, ...] seconds
        // Each request should be roughly (httpDelayLength/1000) seconds after the previous
    }

    if (neverZeroStatus) {
        setTimeout(function() {
            // initial longer delay to wait for HTTP responses.
            // if not all responses are received, the function will wait before printing
                printCSVFile();
            }, printCSVDelayLength);

        }
    }
