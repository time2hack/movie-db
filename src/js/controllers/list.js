

module.exports = function(redirect) {
  return function () {
    var userId = firebase.auth().currentUser.uid;

    // Get a reference to the database service
    var database = firebase.database();
  }
}
