// Import lunar month/day and start/end year from html form
// Returns: array in format: [lunar month, lunar day, start year, end year]
function importDates() {
  let formElements = document.getElementById("lunarForm").elements;

  let dates = [
    Number(formElements.lc_month.value),
    Number(formElements.lc_day.value),
    Number(formElements.lc_leap.value),

    Number(formElements.startYear.value),
    Number(formElements.endYear.value)
  ];

  return dates;
}

// Import event details from html form
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
    Number(formElements.eventLength.value)
  ];

  return resForm;
}

/*
    Download a file
    Param:  fileName - name of download file (including extension)
            fileContents - contents of the file
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
