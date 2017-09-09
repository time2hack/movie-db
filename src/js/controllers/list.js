var firebase = require('firebase');
var $ = require('jquery');
var durationConvertor = require('../utils/duration');

var ListController = function() {
  return function () {
    var userId = firebase.auth().currentUser.uid;

    // Get a reference to the database service
    var markup = '';
    var database = firebase.database();
    var query = firebase.database().ref("movies").orderByChild('createdAt').limitToLast(20);
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(renderSingleSnapshot);
      }).then(function(){
        $(document).find('#list').html(markup);
      });

    var renderSingleSnapshot = function(movieRef) {
      var movie = movieRef.val();
      console.log(movieRef.key, movie);

      var imdb = '';
      var editLink = '';
      var html = '';

      html += '<li class="list-group-item media movie">';
        html += '<div class="media-body">';
        if(movie.uid === userId) {
          editLink = ' <a href="#/edit/'+movieRef.key+'"><i class="fa fa-pencil" aria-hidden="true"></i></a>';
        }
        viewLink = '<a href="#/view/' + movieRef.key + '">' + movie.movieName + '</a>'
        if( movie.imdbUrl !== '' ){
          imdb += ' <a href="' + movie.imdbUrl + '" target="_blank"><i class="fa fa-imdb" aria-hidden="true"></i></a>';
        }
        html += '<h5 class="media-heading">'+ viewLink + imdb + editLink +'</h5>';
        html += '<h6><b>Director: </b>'+movie.directors.join(', ')+'</h6>';
        html += '<small><b>Released in: </b>'+(movie.releaseYear)+'<br/>';
        html += '<b>Duration: </b>'+durationConvertor(movie.duration)+'<br/>';
        html += '<b>Actors: </b>';
        html += (movie.actors || movie.stars).join(', ') + '</small>';
        html += '</div>';
        html += `<div class="media-right"><img class="media-object" height="125" src="${movie.poster}" alt="${movie.movieName}"></div>`;
      html += '</li>';

      //Add new ones on top
      markup = html + markup;
    }
  }
}

ListController.toggleStar = function(movieUniqueId){
  console.log(movieUniqueId);
}

module.exports = ListController;
