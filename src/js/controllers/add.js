var $ = require('jquery');
var firebase = require('firebase');
module.exports = function(Auth, redirect) {
  return function () {
    // Get a reference to the database service
    var database = firebase.database();

    function saveMovie(movie) {
      var uid = firebase.auth().currentUser.uid;
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('movies').push().key;

      // Write the new post's data simultaneously in the movies list and the user's post list.
      var updates = {};
      updates['/movies/' + newPostKey] = movie;
      updates['/user-movies/' + uid + '/' + newPostKey] = movie;

      return firebase.database().ref().update(updates);
    }

    $(document)
      .off('click', '#add')
      .on('click', '#add', function(e) {
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
          stars: $('#stars').val().split(',').map(function(item) {
            return item.trim();
          }),
          imdbUrl: $('#imdbUrl').val(),
          uid: uid
        }
        var response = saveMovie(movie);
        console.log(response)
      })
  }
}
//'{"movieName":"Iron Man","releaseYear":"May, 2008","generes":["Action","Adventure","Sci-Fi"],"duration":"126","directors":["Jon Favreau"],"stars":["Robert Downey Jr.","Gwyneth Paltrow","Terrence Howard","Jeff Bridges"],"imdbUrl":"http://www.imdb.com/title/tt0371746/"}'
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
