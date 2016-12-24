var $ = require('jquery');


var Router = function(config) {
  console.log(config)
  this.routes = config.routes || {};
  this.mountPoint = config.mountPoint || '#root';
  this.indexRoute = config.indexRoute || 'index';
  return this;
}

Router.prototype.setRedirect = function (func) {
  this.prototype.redirect = func;
}

Router.prototype.add = function(route) {
  /**
   * route: {
   *   path: String,
   *   template: path for ajax,
   *   onEnter: function(),
   *   controller: function(),
   *   onLeave: function()
   * }
   */
  this.routes[name] = route;
};

Router.prototype.listen = function() {
  var _self = this
  if ( "onhashchange" in window.document.body ) {
    window.addEventListener('hashchange', function (e) {
      console.log(e);
      _self.render(window.location.hash.replace(/[#\/]/g, ''));
    }, false)
  } else {
    _self.fallback(window);
  }

  //Start with indexRoute
  if(!_self.routes[window.location.hash.replace(/[#\/]/g, '')]){
    _self.go(_self.indexRoute);
  } else {
    console.log('render')
    _self.render(window.location.hash);
  }
}

Router.prototype.go = function(path) {
  window.location.hash = path[0] === '/' ? path : '/' + path;
}

Router.prototype.render = function(name) {
  var _self = this;
  var state = _self.routes[name.replace(/[#\/]/g, '')];
  if( state ){
    console.log(name, state);
    $.get(state.template, function(data){
      $(_self.mountPoint).html(data);
      state.controller();
    })
  } else {
    _self.render(_self.indexRoute);
  }
};

Router.prototype.fallback = function(window) {
  // https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
  // exit if the browser implements that event
  if ( "onhashchange" in window.document.body ) { return; }

  var location = window.location,
    oldURL = location.href,
    oldHash = location.hash;

  // check the location hash on a 100ms interval
  setInterval(function() {
    var newURL = location.href,
      newHash = location.hash;

    // if the hash has changed and a handler has been bound...
    if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
      // execute the handler
      window.onhashchange({
        type: "hashchange",
        oldURL: oldURL,
        newURL: newURL
      });

      oldURL = newURL;
      oldHash = newHash;
    }
  }, 100);
}

module.exports = Router;
