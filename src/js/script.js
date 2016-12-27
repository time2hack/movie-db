var $ = require('jquery');
var Auth = require('./auth')
var Router = require('./router');

//Redirect to some Page or URL
var redirect = function(to) {
  appRouter.go(to)
}

var appRouter = new Router({
  mountPoint: '#root',
  indexRoute: 'index',
  routes: {
    login : {
      path: 'login',
      template: 'partials/login.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( !user && window.location.hash.match('/login') ){
          return true;
        } else {
          return 'index';
        }
      },
      controller: require('./controllers/login')(Auth, redirect)
    },
    index : {
      path: 'index',
      template: 'partials/index.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/index')(Auth, redirect)
    },
    add : {
      path: 'add',
      template: 'partials/add.html',
      onEnter: function() {
        var user = Auth.checkLoggedInUser();
        if( user && !window.location.hash.match('/login') ){
          return true;
        } else {
          return 'login';
        }
      },
      controller: require('./controllers/add')(Auth, redirect)
    }
  }
})

//Error box indexes
var errorIndex = 0;

$(document).ready(function() {
  //Initialize the Firebase App
  Auth.init(function() {

    var user = Auth.checkLoggedInUser();

    if( user ){
      $('.logout-link').css('display', 'block');
      $('.login-link').hide();
    } else {
      $('.login-link').css('display', 'block');
      $('.logout-link').hide();
    }
    appRouter.listen();
  });
})