var firebase = require('firebase');
var $ = require('jquery');

var ListController = function(Auth, redirect) {
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
      console.log(childSnapshot.key, movie);

      var html = '';

      html += '<li class="list-group-item movie">';
        html += '<div>';
        if( movie.imdbUrl === '' ){
          html += '<h5>'+  movie.movieName +'</h5>';
        } else {
          html += '<h5>'+movie.movieName+' <a href="'+movie.imdbUrl+'" target="_blank"><i class="fa fa-imdb" aria-hidden="true"></i></a>' +'</h5>';
        }
        html += '<h6><b>Director: </b>'+movie.directors.join(', ')+'</h6>';
        html += '<small><b>Released in: </b>'+(movie.releaseYear)+'<br/>';
        html += '<b>Duration: </b>'+durationConvertor(movie.duration)+'<br/>';
        html += '<b>Actors: </b>';
        html += (movie.actors || movie.stars).join(', ') + '</small>';
        html += '</div>';
      html += '</li>';

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

ListController.toggleStar = function(movieUniqueId){
  console.log(movieUniqueId);
}

module.exports = ListController;
