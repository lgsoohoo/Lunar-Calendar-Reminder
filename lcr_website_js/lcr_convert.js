
//Converts a range of lunar dates into solar dates
//returns solar dates as array
function solarToLunarRange(
  lunar_month,
  lunar_day,
  lunar_leap,
  start_year,
  end_year
) {
  let converted = [];

  let isee15_converter = new LunarSolarConverter();

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
