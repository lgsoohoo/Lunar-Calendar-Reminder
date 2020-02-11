/**
 * lcr_form.js
 * This file contains functions for interacting with the HTML form
 */

/**
 * Imports the lunar month/day and start/end year from the HTML form
 * 
 * @returns {Array in format: [Lunar month, Lunar day, Start year, End year]}
 */
function importDates() {
  let formElements = document.getElementById("lunarForm").elements;
  let isLeap = formElements.lc_leap.value == "True" ? true : false;

  let dates = [
    Number(formElements.lc_month.value),
    Number(formElements.lc_day.value),
    isLeap,
    Number(formElements.startYear.value),
    Number(formElements.endYear.value)
  ];

  return dates;
}

/**
 * Imports the event details from the HTML form
 * 
 * @returns {Array containing details about the event. Specified in the setup section of 'lcr_run.js'}
 */
function importEventDetails() {
  let formElements = document.getElementById("lunarForm").elements;

  let resForm = [
    formElements.subject.value,
    formElements.startTime.value,
    formElements.endTime.value,
    formElements.allDay.value,
    formElements.desc.value,
    formElements.loc.value,
    formElements.priv.value,
    Number(formElements.eventLength.value)-1
    //Program counts in additional days after the start of the event
    //This is the difference in JS and HTML sides
  ];

  return resForm;
}

/**
 * Create web browser window to download file
 * 
 * @param {name of download file (including extension)} fileName 
 * @param {contents of the file} fileContents 
 */
function downloadFile(fileName, fileContents) {
  // https://stackoverflow.com/a/18197341
  let downloadElement = document.createElement("a");
  downloadElement.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(fileContents)
  );
  downloadElement.setAttribute("download", fileName);

  downloadElement.style.display = "none";
  document.body.appendChild(downloadElement);

  downloadElement.click();

  document.body.removeChild(downloadElement);
}
