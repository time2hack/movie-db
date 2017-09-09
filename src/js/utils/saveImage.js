var firebase = require('firebase');
var mimes = require('../fileTypes');

module.exports = function(file, filename, ref) {
  if(!ref) ref = firebase.storage().ref();
  if(mimes[file.type].extensions[0]) {

    // Create the file metadata
    var metadata = {
      contentType: file.type
    };

    // Upload file and metadata to the object
    var uploadTask = ref.child(filename + '.' + mimes[file.type].extensions[0]).put(file, metadata);

    return uploadTask;
  }
}
