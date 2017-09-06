var $ = require('jquery');
var firebase = require('firebase');
var mimes = require('../fileTypes');
module.exports = function(Auth, redirect) {
  return function () {
    // Get a reference to the database service
    var database = firebase.database();

    function saveMovie(movie) {
      var uid = firebase.auth().currentUser.uid;
      // Get a key for a new Post.
      var newPostKey = firebase.database().ref().child('movies').push().key;

      // Create a root reference
      var storageRef = firebase.storage().ref();
      // Points to 'images'
      var imagesRef = storageRef.child('images');

      var file = $('#poster').get(0).files[0];
      var downloadURL = '';
      var done = function() {
        movie.poster = downloadURL;

        // Write the new post's data simultaneously in the movies list and the user's post list.
        var updates = {};
        updates['/movies/' + newPostKey] = movie;
        updates['/user-movies/' + uid + '/' + newPostKey] = movie;

        return firebase.database().ref().update(updates);
      }
      if(mimes[file.type].extensions[0]) {

        // Create the file metadata
        var metadata = {
          contentType: file.type
        };

        // Upload file and metadata to the object
        var uploadTask = imagesRef.child(newPostKey + '_poster.' + mimes[file.type].extensions[0]).put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        },
        function(error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          console.error(error);
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
          done();
        },
        function() {
          // Upload completed successfully, now we can get the download URL
          downloadURL = uploadTask.snapshot.downloadURL;
          done()
        });
      }
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
          actors: $('#actors').val().split(',').map(function(item) {
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
