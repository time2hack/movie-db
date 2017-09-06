var $ = require('jquery');

module.exports = function (Auth, redirect) {
  return function(){
    console.log('home controller')
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
        if( Auth.logout() ){
          $('.login-link').css('display', 'block');
          $('.logout-link').hide();
          redirectToLogin();
        }
      })
  }
}
