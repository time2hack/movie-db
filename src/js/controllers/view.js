var firebase = require('firebase');
var $ = require('jquery');
var durationConvertor = require('../utils/duration');

module.exports = function () {
  return function (params) {
    // Get a reference to the database service
    var database = firebase.database();
    var query = firebase.database().ref("movies/"+params.id);

    //Fire Query
    query.once("value").then(fillData)
    //Fill The data
    function fillData(snap) {
      var data = snap.val();
      console.log(data)
      $('#movieName').text(data.movieName);
      $('#releaseYear').text(data.releaseYear);
      $('#generes').text((data.generes || []).join(', '))
      if( data.duration && !isNaN(Number(data.duration))) {
        $('#duration').text(', ' + durationConvertor(data.duration));
      }
      $('#directors').text((data.directors || []).join(', '))
      $('#actors').text((data.actors || []).join(', '))
      $('#imdbUrl').text(data.imdbUrl);
    }

  }
}
