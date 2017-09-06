var $ = require('jquery');
var firebase = require('firebase');
module.exports = function(Auth, redirect) {
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
      $('#movieName').val(data.movieName);
      $('#releaseYear').val(data.releaseYear);
      $('#generes').val((data.generes || []).join(', '))
      $('#duration').val(data.duration);
      $('#directors').val((data.directors || []).join(', '))
      $('#actors').val((data.actors || []).join(', '))
      $('#imdbUrl').val(data.imdbUrl);
    }

    //Save function
    function saveMovie(movie) {
      var uid = firebase.auth().currentUser.uid;
      var postKey = params.id;
      console.log(params, postKey)
      var updates = {};
      updates['/movies/' + postKey] = movie;
      updates['/user-movies/' + uid + '/' + postKey] = movie;

      return database.ref().update(updates);
    }

    $(document)
      .off('click', '#save')
      .on('click', '#save', function(e) {
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
        var response = saveMovie(movie).then(function(){
          redirect('list');
        });
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
