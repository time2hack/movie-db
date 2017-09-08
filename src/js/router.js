var $ = require('jquery');


var Router = function(config) {
  var _self = this;
  _self.routes = {};
  _self.patterns = [];
  _self.patternMap = {};
  //This variable will be updated on every hashchange
  _self.params = null;
  _self.mountPoint = config.mountPoint || '#root';
  _self.indexRoute = config.indexRoute || 'index';
  _self.separator =  config.separator || '/';

  //Enhance routes and prepare a flat array of patterns
  Object.keys(config.routes).forEach(function(key) {
    var route = _self.enhanceRoute(config.routes[key]);
    _self.routes[key] = route;
    _self.patterns.push(route.pattern);
    _self.patternMap[route.pattern] = key;
  });

  return _self;
}

Router.prototype.setRedirect = function (func) {
  this.prototype.redirect = func;
}

Router.prototype.enhanceRoute = function (route) {
  if(!route.path){
    throw new Error('Route needs to have a path');
  }

  var path = route.path;
  // Check for params
  var params = path.match(/(:\w*)/g);
  var parts = path.split(this.separator);
  route.parts = parts;
  route.depth = parts.length;
  route.hasParams = params ? Boolean(params.length) : false;

  route.pattern = path;
  // Path has params
  if( route.hasParams ) {
    var positions = params.reduce(function(acc, param) {
      var paramName = param.replace(':', '');
      var index = parts.indexOf(param);
      acc[paramName] = index;
      return acc;
    }, {});
    route.positions = positions;
    route.pattern = path.replace(/(:\w*)/g, '([\\w\\-]*)');
  }

  route.pattern = route.pattern.split(this.separator).join('\\'+this.separator);
  return route;
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
  this.routes[route.name] = route;
};

Router.prototype.listen = function() {
  var _self = this
  if ( 'onhashchange' in window.document.body ) {
    window.addEventListener('hashchange', function (e) {
      console.log(e);
      _self.render(_self.getStateName());
    }, false)
  } else {
    _self.fallback(window);
  }

  var state = _self.getStateName();
  //Start with indexRoute
  if(!_self.routes[state]){
    _self.go(_self.indexRoute);
  } else {
    _self.render(state);
  }
}

Router.prototype.go = function(path) {
  window.location.hash = path[0] === '/' ? path : '/' + path;
}

Router.prototype.getStateName = function(hash) {
  if(!hash) hash = window.location.hash;
  this.params = null;
  var sanitizedHash = hash.replace(/[#]/g, '').replace(/^\//g, '');
  var qualifyingPaths = this.patterns.filter(function(pattern) {
    return !(hash.match(pattern) === null);
  });
  if( qualifyingPaths.length === 1 ) {
    var stateName = this.patternMap[qualifyingPaths[0]];
    var state = this.routes[stateName];
    if( state.hasParams ) {
      var parts = sanitizedHash.split(this.separator);

      this.params = Object.keys(state.positions).reduce(function(acc, key) {
        acc[key] = parts[state.positions[key]];
        return acc;
      }, {});
    }
    // this.params =
    return stateName;
  } else {
    //DO MORE CHECKS
    //Very Rare situation for now
    console.log('You need to manage race condition now!')
  }
  return this.indexRoute;
}

Router.prototype.params = function(stateName, sanitizedHash) {
  _self.routes[state].pattern
}

Router.prototype.replace = function(data, state) {
  var _self = this;
  $(_self.mountPoint).empty().html(data);
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
  if(!name) name = _self.getStateName(name);
  console.log(name);
  var _self = this;
  var state = _self.routes[name];
  if( state ){
    if(typeof state.onEnter === 'function'){
      var enterResponse = state.onEnter();
      if( enterResponse === true ){
        _self.fetchAndReplace.call(_self, name);
      } else if( typeof enterResponse === 'string' ){
        _self.go(enterResponse);
      }
    } else {
      _self.fetchAndReplace.call(_self, name);
    }
    state.controller(_self.params);
  } else {
    _self.render(_self.indexRoute);
  }
};

Router.prototype.fallback = function(window) {
  // https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
  // exit if the browser implements that event
  if ( 'onhashchange' in window.document.body ) { return; }

  var location = window.location,
    oldURL = location.href,
    oldHash = location.hash;

  // check the location hash on a 100ms interval
  setInterval(function() {
    var newURL = location.href,
      newHash = location.hash;

    // if the hash has changed and a handler has been bound...
    if ( newHash != oldHash && typeof window.onhashchange === 'function' ) {
      // execute the handler
      window.onhashchange({
        type: 'hashchange',
        oldURL: oldURL,
        newURL: newURL
      });

      oldURL = newURL;
      oldHash = newHash;
    }
  }, 100);
}

module.exports = Router;
