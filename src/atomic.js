(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.atomic = factory(root);
  }
})(this, function (root) {

  'use strict';

  var exports = {};

  var parse = function (req) {
    var result;
    try {
      result = JSON.parse(req.responseText);
    } catch (e) {
      result = req.responseText;
    }
    return [result, req];
  };

  var xhr = function (type, url, data, options) {
    var methods = {
      success: function () {},
      error: function () {}
    };
    var XHR = root.XMLHttpRequest || ActiveXObject;
    var request = new XHR('MSXML2.XMLHTTP.3.0');
    request.open(type, url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    for(var i in options){
      if(options.hasOwnProperty(i)){
        request.setRequestHeader(i, options[i]);
      }
    }
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          methods.success.apply(methods, parse(request));
        } else {
          methods.error.apply(methods, parse(request));
        }
      }
    };
    request.send(data);
    var callbacks = {
      success: function (callback) {
        methods.success = callback;
        return callbacks;
      },
      error: function (callback) {
        methods.error = callback;
        return callbacks;
      }
    };

    return callbacks;
  };

  exports['get'] = function (src, options) {
    return xhr('GET', src, options);
  };

  exports['put'] = function (url, data, options) {
    if(typeof(src) !== 'string'){
      src = src.url;
      data = src.data;
      options = src;
    }
    return xhr('PUT', url, data, options);
  };

  exports['post'] = function (url, data, options) {
    if(typeof(src) !== 'string'){
      src = src.url;
      data = src.data;
      options = src;
    }
    return xhr('POST', url, data, options);
  };

  exports['delete'] = function (url, options) {
    return xhr('DELETE', url, options);
  };

  return exports;

});
