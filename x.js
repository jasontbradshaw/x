(function () {
  "use strict";

  // detect CORS support and get the relevant constructor for it
  var CORSHttpRequest = (function () {
    if ('withCredentials' in (new XMLHttpRequest())) {
      return XMLHttpRequest;
    } else if (typeof XDomainRequest !== 'undefined') {
      return window.XDomainRequest;
    } else {
      return null;
    }
  }());

  var toArray = function (a) { return Array.prototype.slice.call(a); };
  var has = function (o, p) { return Object.prototype.hasOwnProperty.call(o, p); };
  var each = function (a, callback, context) {
    context = context || null;
    for (var i = 0, length = a.length; i < length; i++) {
      var result = callback.call(context, a[i], i);
      if (result === false) { break; }
    }
  };

  // each time this is called, returns a new string to use as a global JSONP
  // identifier.
  var getJSONPId = function () {
    return (
      '__X_JSONP_CALLBACK_' +
      new Date().getTime() +
      '_' +
      ('' + Math.random()).slice(2)
    );
  };

  // given a list of plain objects, extends the first one with the rest in turn.
  var extend = function () {
    var things = toArray(arguments);
    var target = things.shift();

    // returns either `undefined` (for zero arguments) or the first argument
    // (for one argument);
    if (things.length === 0) { return target; }

    var thing, prop;
    while (things.length > 0) {
      thing = things.shift();

      // copy each property to the target in turn
      for (prop in thing) {
        if (has(thing, prop)) {
          target[prop] = thing[prop];
        }
      }
    }

    return target;
  };

  var x = {
    // the current version of the library, for easy reference
    version: '0.0.0',

    // the global default values used for each request that's sent
    defaults: {
      // the HTTP method to use when making our request. one of: ['DELETE', 'GET',
      // 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'].
      method: 'GET',

      // the type of data to tell the server we want back.
      // TODO: what types do we want to allow?
      content_type: 'application/json',
      accepts: 'application/json',

      // the type of request to make. one of: ['xhr', 'cors', 'jsonp'].
      type: 'xhr',

      // the data to send with the request. if falsy, indicates that no data
      // should be sent. if a string, will be sent as-is. if a plain object, will
      // be serialized to a JSON string using the global JSON object.
      data: null
    }
  };

  // TODO: full documentation once we know what we want to support!
  // the generic request function where the magic happens. `options` is a plain
  // object that tells us how to make the request, and `callback` is a function
  // that receives (`error`, `data`).
  x.request = function (options, callback) {
    // make sure we got a function for our callback, so we can assume this later
    callback = typeof callback === 'function' ? callback : function () {};

    // use our defaults, but override with the user's
    options = extend({}, x.defaults, options);

    if (options.type === 'xhr') {
      // TODO: make a normal request
    } else if (options.type === 'cors') {
      // TODO: make a CORS request
    } else if (options.type === 'jsonp') {
      // TODO: make a JSONP request
    } else {
      throw new TypeError('Invalid `type` value: ' + options.type);
    }

    // TODO: now for the tricky part...
    callback.call(null, new Error('Not implemented!'));
  };

  // add shortcut methods for each HTTP method
  each([
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'put'
  ], function (method) {
    // each shortcut method takes the URL as its first argument, an optional
    // `options` object, then the callback for when the request completes.
    x[method.toLowerCase()] = function (url, options, callback) {
      // handle receiving no options, only a calback
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      // force the URL to our value, and the method to our namesake
      options = extend({}, options, {
        method: method.toUpperCase(),
        url: url
      });

      return x.request(options, callback);
    };
  });

  // export to AMD, Common JS, or window
  if (typeof define === 'function' && define.amd) {
    define([], x);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = x;
  } else {
    window.x = x;
  }
}());
