var firebase = require('firebase');
var $ = require('jquery');

module.exports = function(Auth, redirect) {
  return function () {
    var userId = firebase.auth().currentUser.uid;

    // Get a reference to the database service
    var markup = '';
    var database = firebase.database();
    var query = firebase.database().ref("movies").limitToFirst(20);
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(renderSingleSnapshot);
      }).then(function(){
        $(document).find('#list').html(markup);
      });

    var renderSingleSnapshot = function(childSnapshot) {
      var movie = childSnapshot.val();
      console.log(movie)
      var html = '';
      html += '<li class="list-group-item movie"> \
        <div>';
        if( movie.imdbUrl === '' ){
          html += '<h5>'+  movie.movieName +'</h5>';
        } else {
          html += '<h5>'+ '<a href="'+movie.imdbUrl+'" target="_blank">'+movie.movieName+'</a>' +'</h5>';

        }
        html += '<h6><b>Director: </b>'+movie.directors.join(', ')+'</h6>\
          <small><b>Released in: </b>'+(movie.releaseYear)+'<br/>\
          <b>Duration: </b>'+durationConvertor(movie.duration)+'<br/>\
          <b>Actors: </b>';
      html += (movie.actors || movie.stars).join(', ')
                    +'</small>';
      html += '</div>\
              </li>';
      markup += html;
    }

    var durationConvertor = function(minutes){
      if(typeof minutes === 'string'){
        minutes = Number(minutes);
      }
      var hours = parseInt( minutes/60, 10 );
      var mins = minutes%60;
      return hours+'hr '+mins+'min';
    }
  }
}
