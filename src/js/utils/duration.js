module.exports = function (minutes) {
  if(typeof minutes === 'string'){
    minutes = Number(minutes);
  }
  var hours = parseInt( minutes/60, 10 );
  var mins = minutes%60;
  return hours+'hr '+mins+'min';
}
