var $ = require('jquery');

module.exports = function (Auth, redirect) {
  return function(){
    //Redirect to Home
    var redirectToHome = function(user) {
      if(user){
        redirect('index');
      }
    }

    //Login Wrapper
    var login = function(type, data){
      return Auth.login(type, data);
    };

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

    //Social and Anonymous Auth Scheme Login
    $(document)
    .off('click', '#anonymous,#facebook,#twitter,#google,#github')
    .on('click', '#anonymous,#facebook,#twitter,#google,#github', function(e) {
      login($(this).attr('id'))
        .then(redirectToHome)
    })

    //Register for Email Auth Scheme
    $(document)
    .off('click', '#register')
    .on('click', '#register', function(e) {
      e.preventDefault();
      var data = {email: $('#email').val(), password: $('#password').val()}
      console.log(data);
      $('#email, #password').val('')
      Auth
        .register(data)
        .then(redirectToHome)
    })

    //Email Auth Scheme Login
    $(document)
    .off('click', '#login')
    .on('click', '#login', function(e) {
      e.preventDefault();
      var data = {email: $('#email').val(), password: $('#password').val()}
      console.log(data);
      $('#email, #password').val('')
      login('email', data)
        .then(redirectToHome)
    })
  }
}
