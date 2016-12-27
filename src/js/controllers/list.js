

module.exports = function(redirect) {
  return function () {
    var userId = firebase.auth().currentUser.uid;

    // Get a reference to the database service
    var database = firebase.database();

    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key();
        var childData = childSnapshot.val();
        // ...
      });
    });
  }
}
