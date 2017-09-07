var $ = require('jquery');
var Auth = require('../auth');

module.exports = function (redirect) {
  return function(){
    console.log('view controller')
    //Redirect to Home
    var redirectToHome = function(user) {
      if(user){
        redirect('index');
      }
    }

    //Redirect to Login
    var redirectToLogin = function(user) {
      if(!user){
        redirect('login');
      }
    }

    $('.logout-link').css('display', 'block');
    $('.login-link').hide();

    //Logout Button
    $(document)
      .off('click', '.logout-link')
      .on('click', '.logout-link', function (e) {
        console.log('logout')
        if( Auth.logout() ){
          $('.login-link').css('display', 'block');
          $('.logout-link').hide();
          redirectToLogin();
        }
      })
  }
}
