/**
 * lcr_convert.js
 * This file contains functions for Lunar to Gregorian convertions
 */

 /**
  * Converts a range of Lunar dates into Gregorian dates. Start and end years are inclusive.
  * 
  * @param {which month the lunar event takes place} lunar_month 
  * @param {which day (date) the lunar event takes place} lunar_day 
  * @param {whether or not the event is on a leap year} lunar_leap 
  * @param {what year to start generating (inclusive)} start_year 
  * @param {what year to stop generating (inclusive)} end_year 
  * 
  * @returns {an array of solar dates converted from the lunar dates}
  */
function solarToLunarRange(
  lunar_month,
  lunar_day,
  lunar_leap,
  start_year,
  end_year
) {
  let converted = [];

  let isee15_converter = new LunarSolarConverter();

  // loop through and convert each date
  for (let thisYear = start_year; thisYear < end_year + 1; thisYear++) {
    let lunarDate = new Lunar();
    lunarDate.isleap = lunar_leap;
    lunarDate.lunarDay = lunar_day;
    lunarDate.lunarMonth = lunar_month;
    lunarDate.lunarYear = thisYear;

    let newSolarDate = isee15_converter.LunarToSolar(lunarDate);

    converted.push(newSolarDate);
  }

  return converted;
}
