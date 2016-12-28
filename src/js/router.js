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
   *   template: template string,
   *   templateUrl: path for ajax,
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
      _self.render(_self.getStateName(window.location.hash));
    }, false)
  } else {
    _self.fallback(window);
  }

  //Start with indexRoute
  if(!_self.routes[_self.getStateName(window.location.hash)]){
    _self.go(_self.indexRoute);
  } else {
    console.log('render')
    _self.render(window.location.hash);
  }
}

Router.prototype.go = function(path) {
  window.location.hash = path[0] === '/' ? path : '/' + path;
}

Router.prototype.getStateName = function(hash) {
  return hash.replace(/[#\/]/g, '')
}

Router.prototype.replace = function(data, state) {
  var _self = this;
  console.log(state)
  $(_self.mountPoint).empty().html(data);
  _self.routes[state].controller();
}

Router.prototype.fetch = function(path, state, callback) {
  var _self = this;
  $.get(path, function(data){
    _self.routes[state].template = data;
    callback.call(_self, data, state);
  })
}

Router.prototype.fetchAndReplace = function(stateName) {
  var _self = this;
  var state = _self.routes[stateName];

  if( state.templateUrl ){
    if( !state.template){
      _self.fetch.call(_self, state.templateUrl, stateName, _self.replace);
    } else {
      _self.replace.call(_self, state.template, stateName);
    }
  } else {
    _self.replace.call(_self, state.template, stateName);
  }
}

Router.prototype.render = function(name) {
  var _self = this;
  var stateName = _self.getStateName(name);
  var state = _self.routes[stateName];
  if( state ){
    console.log(name, state);
    if(typeof state.onEnter === 'function'){
      var enterResponse = state.onEnter();
      if( enterResponse === true ){
        _self.fetchAndReplace.call(_self, stateName);
      } else if( typeof enterResponse === 'string' ){
        _self.go(enterResponse);
      }
    } else {
      _self.fetchAndReplace.call(_self, stateName);
    }
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
