var $ = require('jquery');
var firebase = require('firebase');
var saveImage = require('../utils/saveImage');


module.exports = function(Auth, redirect) {
  var done = function(movie, newPostKey) {
    movie.createdAt = +new Date();
    // Write the new post's data simultaneously in the movies list and the user's post list.
    var updates = {};
    updates['/movies/' + newPostKey] = movie;
    updates['/user-movies/' + movie.uid + '/' + newPostKey] = movie;
    firebase.database().ref().update(updates).then(function() {
      redirect('view/'+newPostKey);
    });
  }
  return function () {
    // Get a reference to the database service
    var database = firebase.database();

    function saveMovie(movie) {
      var uid = firebase.auth().currentUser.uid;
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('movies').push().key;

      var imagesRef = firebase.storage().ref().child('images');

      var file = $('#poster').get(0).files[0];
      movie.poster = '';
      if(file) {
        var task = saveImage(file, newPostKey + '_poster', imagesRef)
        task.then(function(snapshot){
            movie.poster = task.snapshot.downloadURL;
            done(movie, newPostKey);
          })
          .catch(function(error){
            console.error(error)
            done(movie, newPostKey);
          });
      } else {
        done(movie, newPostKey);
      }
    }

    $(document)
      .off('click', '#add')
      .on('click', '#add', function(e) {
        $('#add').off('click').attr('disabled', true);

        var uid = firebase.auth().currentUser.uid;
        var movie = {
          movieName: $('#movieName').val(),
          releaseYear: $('#releaseYear').val(),
          generes: $('#generes').val().split(',').map(function(item) {
            return item.trim();
          }),
          duration: $('#duration').val(),
          directors: $('#directors').val().split(',').map(function(item) {
            return item.trim();
          }),
          actors: $('#actors').val().split(',').map(function(item) {
            return item.trim();
          }),
          imdbUrl: $('#imdbUrl').val(),
          uid: uid
        }
        saveMovie(movie);
      })
  }
}
//'{"movieName":"Iron Man","releaseYear":"May, 2008","generes":["Action","Adventure","Sci-Fi"],"duration":"126","directors":["Jon Favreau"],"actors":["Robert Downey Jr.","Gwyneth Paltrow","Terrence Howard","Jeff Bridges"],"imdbUrl":"http://www.imdb.com/title/tt0371746/"}'
/*
Object.keys(movie).map(function(key) {
  if(typeof movie[key] === 'string'){
    document.querySelector('#'+key).setAttribute('value', movie[key])
  } else {
    document.querySelector('#'+key).setAttribute('value', movie[key].join(', '))
  }
  return key;
})
*/
