/*
    Lunar Calendar Reminder (JS)
    Lucas Soohoo
    August, 2019

    This is the JAVASCRIPT version of the "LunarCalendarReminder" program.
    The PYTHON version is recommended.

    This version of the program can be run in your browser's console
    and will print out the data in the console, which can be copy-pasted into a
    CSV file and then imported into Google Calendar.

    To use this program:
    1. Edit program parameters in the <Setup> section
    2. Open a web browser and go to: https://pteo.paranoiaworks.mobi/chinese_calendar/
        a. This is required as CORS will block the HTTP requests
    3. Open the web browser console and copy-paste all of the code
        a. You may be required to allow pasting into the console
    4. Open a text editor and paste the header as the first line (without the quotes)
        a. Header: "Subject, Start Date, Start Time, End Date, End Time, All Day Event, Description, Location, Private"
    5. Paste the console output into a text editor and save as a ".csv" file
    5. Upload into Google Calendar

*/

/*     =====  <Setup>  ======     */

// Lunar calendar date ====================
var lunarDay = 1;
var lunarMonth = 1;

var startYear = 2019; // Year to start generating event reminders
var yearsToGenerate = 10; // Number of years to generate

// Event Details ====================
// For more info, see: https://support.google.com/calendar/answer/37118
var csvSubject = ""; // The name of the event, required. Example: Final exam
var csvStartTime = ""; // The time the event begins. Example: 10:00 AM
var useEndDate = false; // Whether the event lasts multiple days
var eventLength = 0; // Number of days the event lasts. Only required if `useEndDate` is `true`
var csvEndTime = ""; // The time the event ends. Example: 1:00 PM
var csvAllDayEvent = "True"; // Whether the event is an all-day event. Enter `True` if it is an all-day event, and `False` if it isn't.
var csvDescription = `Lunar Calendar:${lunarMonth}\\${lunarDay} converted to Gregorian`; // Description or notes about the event. Example: 50 multiple choice questions and two essay questions
var csvLocation = ""; // The location for the event. Example: "Columbia, Schermerhorn 614"
var csvPrivate = "True"; // Whether the event should be marked private. Enter `True` if the event is private, and `False` if it isn't.

/*     =====  </Setup>  =====     */


// CSV Header ====================
var csvHeader = "Subject, Start Date, Start Time, End Date, End Time, All Day Event, Description, Location, Private";
// `csvHeader` should not be modified as this exact header is required by Google Calendar

// Program ====================
for (let year = startYear; year < startYear + yearsToGenerate; year++) {
    /* Using `let` keeps visiblity only inside the block. (if you use `var` then the `timeout` doesnt work)
    In this case, using `var` means that when the `timeout` gets triggered, then each function call
    will use the value of `year` when the loop has finished, rather than each year as we expect */

    setTimeout(function() {
        // Small delay so the server won't get overloaded
        lunarToGregorian(year, lunarMonth, lunarDay);
    }, (year - startYear) * 1000); //schedule them for [0, 1, 2, ...] seconds after each iteration

}

// Converts a Lunar Calendar date to a Gregorian Calendar date using https://pteo.paranoiaworks.mobi/chinese_calendar
function lunarToGregorian(varYear, varMonth, varDay) {
    // Send HTTP requests in a function so the XMLHttpRequest's don't interfere with each other
    var oReq = new XMLHttpRequest();

    var link = "https://pteo.paranoiaworks.mobi/chinese_calendar/cncalprov.php?g2c=0&year=" + varYear + "&month=" + varMonth + "&date=" + varDay + "&leap=0";

    oReq.onreadystatechange = function() {
        if (oReq.readyState == XMLHttpRequest.DONE) {
            if (oReq.status == 500) {
                // Received an error (serer down because we sent too many requests too quickly)
                // We need to resubmit

                setTimeout(function() {
                    // add a 1 second delay to allow server to recover
                    oReq.open("GET", link);
                    oReq.send();
                }, 1000);

            } else {

                var rawRes = oReq.responseText;
                //Possible response formats:
                // <ERROR>Invalid input date (mm/dd/yyyy)</ERROR>
                // <ROOT><YEAR>2018</YEAR><MONTH>09</MONTH><DAY>08</DAY><LEAP>0</LEAP>...

                //if (Bad request / Invalid input date) { Don't bother with printing }
                if (!rawRes.includes("Invalid")) {

                    // Extract the Gregorian Calendar date from the xml
                    // https://stackoverflow.com/a/14867897

                    var startIndex = rawRes.lastIndexOf("<YEAR>") + 6; //+6 so it wont print "YEAR>"
                    var endIndex = rawRes.lastIndexOf("</YEAR>");
                    var gregYear = rawRes.substring(startIndex, endIndex);

                    startIndex = rawRes.lastIndexOf("<MONTH>") + 7;
                    endIndex = rawRes.lastIndexOf("</MONTH>");
                    var gregMonth = rawRes.substring(startIndex, endIndex);

                    startIndex = rawRes.lastIndexOf("<DAY>") + 5;
                    endIndex = rawRes.lastIndexOf("</DAY>");
                    var gregDay = rawRes.substring(startIndex, endIndex);

                    var gregDate = gregMonth + "/" + gregDay + "/" + gregYear

                    console.log(csvSubject + ", " + gregDate + ", " + csvStartTime + ", , " + csvEndTime + ", " + csvAllDayEvent + ", " + csvDescription + ", " + csvLocation + ", " + csvPrivate)
                }
            }
        }
    } // end oReq.onreadystatechange = function()...

    oReq.open("GET", link);
    oReq.send();

} // end lunarToGregorian()
