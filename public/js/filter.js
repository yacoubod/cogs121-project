function priceInRange(price) {
  var priceMax;
  var priceLevel = $("#priceLevels").val();
  switch(priceLevel) {
      case "$500":
          priceMax = 500;
          break;
      case "$1000":
          priceMax = 1000;
          break;
      default:
          priceMax = 10000;
  }
  if (price > priceMax) {
    return false;
  }
}

/* function dateInRange(date) {
  var rangeMax;
  var dateRange = $("#dateRanges").val();
  switch(dateRange) {
      case "1 week":
          rangeMax = 7;
          break;
      case "2 weeks":
          rangeMax = 14;
          break;
      case "2 months":
          rangeMax = 21;
          break;
      default:
          priceMax = 10000;
  }
  var daysUntil = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
  if daysUntil
} */
