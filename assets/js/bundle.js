/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/previewImage.js":
/*!*****************************!*\
  !*** ./src/previewImage.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "implementPreviewImage": () => (/* binding */ implementPreviewImage)
/* harmony export */ });
const previewImage = (e, targetElement) => {
    let reader = new FileReader();

    reader.onload = () => {
        let output = targetElement;
        output.src = reader.result;
    }
    if (e.target.files[0]) {
        showImageHideChoose()
        reader.readAsDataURL(e.target.files[0]);
    } else {
        showChooseHideImage()
    }
}

const overlayOn = () => {
    let overlay = document.getElementById("image-overlay");
    let deleteButton = document.getElementById("delete-button");
    if (overlay.classList.contains("hide")) {
        overlay.classList.remove("hide");
    }
    if (deleteButton.classList.contains("hide")) {
        deleteButton.classList.remove("hide");
    }
}

const overlayOff = () => {
    let overlay = document.getElementById("image-overlay");
    let deleteButton = document.getElementById("delete-button");
    if (!overlay.classList.contains("hide")) {
        overlay.classList.add("hide");
    }
    if (!deleteButton.classList.contains("hide")) {
        deleteButton.classList.add("hide");
    }
}

const showChooseHideImage = () => {
    document.getElementById("image-button").classList.remove("hide");
    document.getElementById("preview-div").classList.add("hide");
}

const showImageHideChoose = () => {
    document.getElementById("image-button").classList.add("hide");
    document.getElementById("preview-div").classList.remove("hide");
}

const implementPreviewImage = () => {
    let element = document.getElementsByClassName("image-upload")[0];

    let imageToUpload = document.getElementById("image-to-upload");
    if (imageToUpload) {
        element.addEventListener('change', (e) => previewImage(e, document.getElementById("image-to-upload")));
    }

    let addButton = document.getElementById("image-button");
    if (addButton) {
        addButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementsByClassName("image-upload")[0].click();
        })
    }

    let deleteButton = document.getElementById("delete-button");
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            let imageUpload = document.getElementsByClassName("image-upload")[0];
            imageUpload.value = null;
            document.getElementById("image-button").classList.remove("hide");
            document.getElementById("preview-div").classList.add("hide");
        })
    }

    // To show delete option

    let previewDiv = document.getElementById("preview-div");
    if (previewDiv) {
        previewDiv.addEventListener('mouseover', (e) => {
            overlayOn();
        })

        previewDiv.addEventListener('mouseleave', (e) => {
            overlayOff();
        })
        // For mobile users

        document.getElementById("preview-div").addEventListener('touchstart', (e) => {
            overlayOn();
        }, { passive: true })

        document.addEventListener('touchstart', (e) => {
            if (!hasParent(e.target, document.getElementById("preview-div"))) {
                overlayOff();
            }
        })
    }
}



/***/ }),

/***/ "./src/wordCounter.js":
/*!****************************!*\
  !*** ./src/wordCounter.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "implementWordCount": () => (/* binding */ implementWordCount)
/* harmony export */ });
// Helper functions

const getMaxWordCount = (element) => {
    let classList = element.classList;
    for (let index = 0; index < classList.length; index++) {
        if (classList[index].includes("cw-")) {
            return parseInt(classList[index].split("-")[1]);
        }
    }

    return 500;
}

const convertStringToArray = (str) => {
    return str.split(" ");
}

const sanitiseArray = (strArray) => {
    return strArray.filter(d => d != "");
}

const getCleanStringArray = (str) => {
    const strArray = convertStringToArray(str);
    return sanitiseArray(strArray);
}

const isStringWithinWordCount = (str, maxCount) => {
    const cleanStrArray = getCleanStringArray(str);
    let count = cleanStrArray.length;
    return count <= maxCount;
}

const getCountElement = (counterWrapper) => {
    const children = counterWrapper.children;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.classList.contains("count")) {
            return child;
        }
    }
}

const trimStringToMaxCount = (str, maxCount) => {
    const cleanStrArray = getCleanStringArray(strArray);
    const trimmedStrArray = cleanStrArray.slice(0, maxCount);
    const newStr = trimmedStrArray.join(" ");
    return newStr;
}

const createCounter = (maxCount) => {
    let counterWrapper = document.createElement("p");
    counterWrapper.innerHTML = `Word Count: <span class="count">0</span>/<span>${maxCount}</span>`;
    return counterWrapper
}

const insertCounter = (wordsCounted, counterWrapper) => {
    wordsCounted.parentNode.insertBefore(counterWrapper, wordsCounted.nextSibling);
}

// End of helper functions


const updateWordCount = (e, counterWrapper) => {
    let count = 0;
    let maxCount = getMaxWordCount(e.target);

    if (isStringWithinWordCount(e.target.value, maxCount)) {
        count = getCleanStringArray(e.target.value).length;
    } else {
        e.target.value = trimStringToMaxCount(e.target.value, maxCount);
        count = maxCount;
    }

    let countElement = getCountElement(counterWrapper);
    countElement.innerHTML = count;
}

const implementWordCount = () => {
    let wordCountElements = document.getElementsByClassName("countWords");
    
    for (let index = 0; index < wordCountElements.length; index++) {
        const wordsCounted = wordCountElements[index];
        if (wordsCounted.tagName != "TEXTAREA") {
            continue;
        }

        let maxCount = getMaxWordCount(wordsCounted);
        let counterWrapper = createCounter(maxCount);
        insertCounter(wordsCounted, counterWrapper);
        
        wordsCounted.addEventListener('input', (e) => updateWordCount(e, counterWrapper));
    }
}

/***/ }),

/***/ "./src/classes/Icon.ts":
/*!*****************************!*\
  !*** ./src/classes/Icon.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Icon = /** @class */ (function () {
    function Icon(icon) {
        this.node = icon;
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }
    // Public Null
    Icon.prototype.show = function () {
        if (this.node.classList.contains("hide")) {
            this.node.classList.remove("hide");
        }
    };
    // Public Null
    Icon.prototype.hide = function () {
        if (!this.node.classList.contains("hide")) {
            this.node.classList.add("hide");
        }
    };
    return Icon;
}());
exports.default = Icon;


/***/ }),

/***/ "./src/classes/Link.ts":
/*!*****************************!*\
  !*** ./src/classes/Link.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HamburgerNavLink = exports.TopNavLink = void 0;
var Icon_1 = __importDefault(__webpack_require__(/*! ./Icon */ "./src/classes/Icon.ts"));
var Link = /** @class */ (function () {
    function Link(link, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        this.labelMappings = {};
        this.node = link;
        this.labelMappings = labelMappings;
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.isHidden = this.isHidden.bind(this);
    }
    // Public Null
    Link.prototype.hide = function () {
        if (!this.node.classList.contains("hide")) {
            this.node.classList.add("hide");
        }
    };
    // Public Null
    Link.prototype.show = function () {
        if (this.node.classList.contains("hide")) {
            this.node.classList.remove("hide");
        }
    };
    // Public Bool
    Link.prototype.isHidden = function () {
        if (this.node.classList.contains("hide")) {
            return true;
        }
        return false;
    };
    return Link;
}());
var TopNavLink = /** @class */ (function (_super) {
    __extends(TopNavLink, _super);
    function TopNavLink(link, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        var _this = _super.call(this, link, labelMappings) || this;
        _this.hasChildren = false; // Bool
        _this.childLinks = []; // Array<HTMLElement>
        for (var i = 0; i < _this.node.children.length; i++) {
            var child = _this.node.children[i];
            // child is HTMLElement
            if (child.classList.contains("navLink")) {
                _this.link = child;
            }
            else if (child.classList.contains("navChildItems")) {
                _this.childLinksNode = child;
                _this.hasChildren = true;
            }
            else if (child.classList.contains("linkIcon")) {
                _this.icon = new Icon_1.default(child);
            }
        }
        if (_this.hasChildren) {
            for (var i = 0; i < _this.childLinksNode.children.length; i++) {
                var link_1 = _this.childLinksNode.children[i];
                _this.childLinks = __spreadArray(__spreadArray([], __read(_this.childLinks)), [link_1]);
            }
        }
        // create new li in .navChildItems at beginning of list
        // append a element from topNav to new li
        // append new div to original .navItem
        if (_this.hasChildren) {
            // this.formatLink();
        }
        return _this;
    }
    Object.defineProperty(TopNavLink.prototype, "width", {
        // Public Int
        get: function () {
            var linkRect = this.node.getBoundingClientRect();
            return linkRect.right - linkRect.left;
        },
        enumerable: false,
        configurable: true
    });
    TopNavLink.prototype.formatLink = function () {
        var mainLinkInnerHtml = this.link.innerHTML.trim();
        var label = "Label";
        for (var title in this.labelMappings) {
            if (Object.hasOwnProperty.call(this.labelMappings, title)) {
                if (title == mainLinkInnerHtml) {
                    label = this.labelMappings[title];
                }
            }
        }
        var newNavChildItem = document.createElement("LI");
        newNavChildItem.classList.add("navChildItem");
        this.childLinksNode.prepend(newNavChildItem);
        newNavChildItem.appendChild(this.link);
        var newLabel = document.createElement("DIV");
        newLabel.innerHTML = label;
        newLabel.classList.add("navLink");
        newLabel.classList.add("navLabel");
        this.node.prepend(newLabel);
    };
    TopNavLink.prototype.toggle = function () {
        if (this.childLinksNode.classList.contains("hide")) {
            this.open();
        }
        else {
            this.close();
        }
    };
    TopNavLink.prototype.open = function () {
        var linkBox = this.node.getBoundingClientRect();
        var height = linkBox.bottom - linkBox.top;
        this.childLinksNode.style.top = height + "px";
        this.childLinksNode.classList.remove("hide");
        this.node.classList.add("open");
    };
    TopNavLink.prototype.close = function () {
        if (this.childLinksNode) {
            this.childLinksNode.classList.add("hide");
            this.node.classList.remove("open");
        }
    };
    return TopNavLink;
}(Link));
exports.TopNavLink = TopNavLink;
var HamburgerNavLink = /** @class */ (function (_super) {
    __extends(HamburgerNavLink, _super);
    function HamburgerNavLink(link) {
        var _this = _super.call(this, link) || this;
        _this.hasChildren = false; // Bool
        _this.childLinks = []; // Array<HTMLElement>
        for (var i = 0; i < _this.node.children.length; i++) {
            var child = _this.node.children[i];
            if (child.classList.contains("hamburgerLink")) {
                _this.link = child;
                for (var j = 0; j < child.children.length; j++) {
                    var subChild = child.children[j];
                    if (subChild.classList.contains("linkIcon")) {
                        _this.hasChildren = true;
                        _this.desktopIcon = new Icon_1.default(subChild);
                    }
                }
            }
            else if (child.classList.contains("hamburgerChildItems")) {
                _this.childLinksNode = child;
            }
            else if (child.classList.contains("linkIcon")) {
                _this.mobileIcon = new Icon_1.default(child);
                _this.mobileIcon.hide();
            }
        }
        if (_this.hasChildren) {
            for (var i = 0; i < _this.childLinksNode.children.length; i++) {
                var link_2 = _this.childLinksNode.children[i];
                _this.childLinks = __spreadArray(__spreadArray([], __read(_this.childLinks)), [link_2]);
            }
        }
        return _this;
    }
    Object.defineProperty(HamburgerNavLink.prototype, "isMenuOpen", {
        get: function () {
            if (this.childLinksNode.style.maxHeight) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    HamburgerNavLink.prototype.toggle = function () {
        if (this.isMenuOpen) {
            // this.mobileIcon.node.classList.remove("spin");
            this.close();
        }
        else {
            // this.mobileIcon.node.classList.add("spin");
            this.open();
        }
    };
    HamburgerNavLink.prototype.close = function () {
        if (this.childLinksNode) {
            this.childLinksNode.style.maxHeight = null;
        }
    };
    HamburgerNavLink.prototype.open = function () {
        if (this.childLinksNode) {
            this.childLinksNode.style.maxHeight = this.childLinksNode.scrollHeight + "px";
        }
    };
    return HamburgerNavLink;
}(Link));
exports.HamburgerNavLink = HamburgerNavLink;


/***/ }),

/***/ "./src/classes/NavMenu.ts":
/*!********************************!*\
  !*** ./src/classes/NavMenu.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TopNav = exports.Hamburger = void 0;
var Link_1 = __webpack_require__(/*! ./Link */ "./src/classes/Link.ts");
var NavMenu = /** @class */ (function () {
    function NavMenu(menu, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        this.links = []; // Array<Link>
        this.labelMappings = {};
        this.node = menu;
        this.labelMappings = labelMappings;
        this.hideAll = this.hideAll.bind(this);
        this.showAll = this.showAll.bind(this);
    }
    // Public Null
    NavMenu.prototype.hideAll = function () {
        this.links.forEach(function (link) { return link.hide(); });
    };
    // Public Null
    NavMenu.prototype.showAll = function () {
        this.links.forEach(function (link) { return link.show(); });
    };
    return NavMenu;
}());
var Hamburger = /** @class */ (function (_super) {
    __extends(Hamburger, _super);
    function Hamburger(menu) {
        var _this = _super.call(this, menu) || this;
        for (var i = 0; i < _this.node.children.length; i++) {
            var link = _this.node.children[i];
            var newLink = new Link_1.HamburgerNavLink(link);
            _this.links = __spreadArray(__spreadArray([], __read(_this.links)), [newLink]);
        }
        _this.addEventListeners();
        _this.show = _this.show.bind(_this);
        _this.hide = _this.hide.bind(_this);
        _this.toMobile = _this.toMobile.bind(_this);
        _this.toDesktop = _this.toDesktop.bind(_this);
        _this.showOne = _this.showOne.bind(_this);
        return _this;
    }
    Object.defineProperty(Hamburger.prototype, "isMobile", {
        // Public Bool
        get: function () {
            if (this.node.classList.contains("mobile")) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hamburger.prototype, "isHidden", {
        // Public Bool
        get: function () {
            if (this.node.classList.contains("hide")) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    // Public Null
    Hamburger.prototype.show = function () {
        this.node.classList.remove("hide");
    };
    // Public Null
    Hamburger.prototype.hide = function () {
        var _this = this;
        this.node.classList.add("hide");
        setTimeout(function () {
            _this.closeAllMenus();
        }, 150);
    };
    // Public Null
    Hamburger.prototype.toMobile = function () {
        this.node.classList.add("mobile");
        this.links.forEach(function (link) {
            if (link.desktopIcon) {
                link.desktopIcon.hide();
            }
            if (link.mobileIcon) {
                link.mobileIcon.show();
            }
        });
    };
    // Public Null
    Hamburger.prototype.toDesktop = function () {
        this.node.classList.remove("mobile");
        this.links.forEach(function (link) {
            if (link.desktopIcon) {
                link.desktopIcon.show();
            }
            if (link.mobileIcon) {
                link.mobileIcon.hide();
            }
        });
    };
    // Public Null
    Hamburger.prototype.showOne = function () {
        for (var i = this.links.length - 1; i >= 0; i--) {
            var link = this.links[i];
            if (link.isHidden()) {
                link.show();
                break;
            }
        }
    };
    Hamburger.prototype.handleLinks = function (link) {
        console.log(link.isMenuOpen);
        if (!link.isMenuOpen) {
            this.closeAllMenus();
            link.open();
        }
        else {
            link.close();
        }
    };
    Hamburger.prototype.addEventListeners = function () {
        var _this = this;
        this.links.forEach(function (link) {
            if (link.hasChildren) {
                link.node.addEventListener("click", function () {
                    console.log("click");
                    _this.handleLinks(link);
                });
            }
        });
    };
    Hamburger.prototype.closeAllMenus = function () {
        this.links.forEach(function (link) {
            link.close();
        });
    };
    return Hamburger;
}(NavMenu));
exports.Hamburger = Hamburger;
var TopNav = /** @class */ (function (_super) {
    __extends(TopNav, _super);
    function TopNav(menu, labelMappings) {
        if (labelMappings === void 0) { labelMappings = {}; }
        var _this = _super.call(this, menu, labelMappings) || this;
        for (var i = 0; i < _this.node.children.length; i++) {
            var link = _this.node.children[i];
            var newLink = new Link_1.TopNavLink(link, _this.labelMappings);
            _this.links = __spreadArray(__spreadArray([], __read(_this.links)), [newLink]);
        }
        _this.hideOne = _this.hideOne.bind(_this);
        _this.closeAllMenus = _this.closeAllMenus.bind(_this);
        _this.addEventListeners();
        return _this;
    }
    Object.defineProperty(TopNav.prototype, "totalWidth", {
        // Public Int
        get: function () {
            var width = 0;
            this.links.forEach(function (link) {
                width += link.width;
            });
            return width;
        },
        enumerable: false,
        configurable: true
    });
    // Public Null
    TopNav.prototype.hideOne = function () {
        for (var i = this.links.length - 1; i >= 0; i--) {
            var link = this.links[i];
            if (!link.isHidden()) {
                link.hide();
                break;
            }
        }
    };
    TopNav.prototype.handleLinks = function (link) {
        if (link.childLinksNode.classList.contains("hide")) {
            this.closeAllMenus();
            link.open();
        }
        else {
            link.close();
        }
    };
    TopNav.prototype.addEventListeners = function () {
        var _this = this;
        this.links.forEach(function (link) {
            if (link.hasChildren) {
                link.node.addEventListener("click", function () {
                    _this.handleLinks(link);
                });
            }
        });
    };
    TopNav.prototype.closeAllMenus = function () {
        this.links.forEach(function (link) {
            link.close();
        });
    };
    return TopNav;
}(NavMenu));
exports.TopNav = TopNav;


/***/ }),

/***/ "./src/classes/Navigation.ts":
/*!***********************************!*\
  !*** ./src/classes/Navigation.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var NavMenu_1 = __webpack_require__(/*! ./NavMenu */ "./src/classes/NavMenu.ts");
var Navigation = /** @class */ (function () {
    function Navigation(nav, labelMapping) {
        if (labelMapping === void 0) { labelMapping = {}; }
        // HTMLElement nav
        this.getNavItems = this.getNavItems.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.moveAllToHamburger = this.moveAllToHamburger.bind(this);
        this.moveAllToNav = this.moveAllToNav.bind(this);
        this.moveOneToHamburger = this.moveOneToHamburger.bind(this);
        this.isNavWrapped = this.isNavWrapped.bind(this);
        this.handleMouseOverHamburger = this.handleMouseOverHamburger.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.labelMappings = labelMapping;
        this.fullNav = nav;
        this.getNavItems();
        this.addEventListeners();
    }
    // Private Null
    Navigation.prototype.getNavItems = function () {
        for (var i = 0; i < this.fullNav.children.length; i++) {
            var child = this.fullNav.children[i];
            // child is HTMLElement
            if (child.classList.contains("topNav")) {
                this.topNav = new NavMenu_1.TopNav(child, this.labelMappings);
            }
            else if (child.classList.contains("hamburgerWrapper")) {
                this.hamburgerWrapper = child;
            }
        }
        if (!this.topNav || !this.hamburgerWrapper) {
            throw new Error("Invalid Navigation Structure");
        }
        for (var i = 0; i < this.hamburgerWrapper.children.length; i++) {
            var child = this.hamburgerWrapper.children[i];
            // child is HTMLElement
            if (child.classList.contains("hamburgerButton")) {
                this.hamburgerButton = child;
            }
            else if (child.classList.contains("hamburger")) {
                this.hamburger = new NavMenu_1.Hamburger(child);
            }
        }
        if (!this.hamburgerButton || !this.hamburger) {
            throw new Error("Invalid Hamburger Navigation Structure");
        }
    };
    // Public Null
    Navigation.prototype.handleResize = function () {
        // for mobile
        if (document.documentElement.clientWidth <= 768) {
            this.moveAllToHamburger();
            // this.hamburger.toMobile();
        }
        // for desktop
        else {
            this.moveAllToNav();
            this.hamburger.toDesktop();
            while (this.isNavWrapped()) {
                this.moveOneToHamburger();
            }
        }
    };
    // Private Null
    Navigation.prototype.moveAllToHamburger = function () {
        this.hamburger.showAll();
        this.topNav.hideAll();
    };
    // Private Null
    Navigation.prototype.moveAllToNav = function () {
        this.hamburgerWrapper.classList.add("hide");
        this.hamburger.hideAll();
        this.topNav.showAll();
    };
    // Private Null
    Navigation.prototype.moveOneToHamburger = function () {
        this.hamburgerWrapper.classList.remove("hide");
        this.topNav.hideOne();
        this.hamburger.showOne();
    };
    // Private Bool
    Navigation.prototype.isNavWrapped = function () {
        var navigationRect = this.fullNav.getBoundingClientRect();
        var navWidth = navigationRect.right - navigationRect.left;
        var linksWidth = this.topNav.totalWidth;
        // 50 is icon width, refactor later to use actual icon width
        if (linksWidth > navWidth - 50) {
            return true;
        }
        return false;
    };
    // Private HTMLElement
    Navigation.prototype.getParentIfTagMatchesNode = function (node, excludedTag) {
        // HTMLElement node, String excludedTag
        if (node.tagName == excludedTag) {
            return node.parentElement;
        }
        else {
            return node;
        }
    };
    // Private Null
    Navigation.prototype.handleMouseOverHamburger = function (link) {
        // Link link
        if (link.hasChildren) {
            var linkBox = link.node.getBoundingClientRect();
            if (!this.hamburger.isMobile) {
                var width = linkBox.right - linkBox.left;
                link.childLinksNode.style.right = width + "px";
                link.childLinksNode.classList.remove("hide");
            }
        }
    };
    // Private Null
    Navigation.prototype.handleMouseLeaveHamburger = function (link) {
        // Link link
        if (link.hasChildren) {
            link.childLinksNode.style.right = "0px";
            link.childLinksNode.classList.add("hide");
        }
    };
    // Private Null
    Navigation.prototype.handleMouseOverNav = function (link) {
        // Link link
        if (link.hasChildren) {
            var linkBox = link.node.getBoundingClientRect();
            var height = linkBox.bottom - linkBox.top;
            link.childLinksNode.style.top = height + "px";
            link.childLinksNode.classList.remove("hide");
        }
    };
    // Private Null
    Navigation.prototype.handleMouseLeaveNav = function (link) {
        // Link link
        if (link.hasChildren) {
            link.childLinksNode.classList.add("hide");
        }
    };
    // Private Null
    Navigation.prototype.handleHamburgerButton = function () {
        // Hamburger hamburger
        if (this.hamburger.isHidden) {
            this.hamburger.show();
        }
        else {
            this.hamburger.hide();
        }
    };
    // Private Null
    Navigation.prototype.handleExpandSubMenuButton = function (link) {
        // Link link
        if (link.childLinksNode.style.maxHeight) {
            link.mobileIcon.node.classList.remove("spin");
            link.childLinksNode.style.maxHeight = null;
        }
        else {
            link.mobileIcon.node.classList.add("spin");
            link.childLinksNode.style.maxHeight = link.childLinksNode.scrollHeight + "px";
        }
    };
    Navigation.prototype.getParents = function (elem) {
        if (elem.tagName == "HTML") {
            return [elem];
        }
        return __spreadArray([elem.parentElement], __read(this.getParents(elem.parentElement)));
    };
    Navigation.prototype.hasParent = function (elem, parentElement) {
        var parents = this.getParents(elem);
        for (var i = 0; i < parents.length; i++) {
            var parent_1 = parents[i];
            if (parent_1 == parentElement) {
                return true;
            }
        }
        return false;
    };
    // Private Null
    Navigation.prototype.handlePageClick = function (e) {
        if (!this.hasParent(e.target, this.hamburgerWrapper)) {
            this.hamburger.hide();
        }
        if (!this.hasParent(e.target, this.topNav.node)) {
            this.topNav.closeAllMenus();
        }
    };
    // Private Null
    Navigation.prototype.show = function () {
        this.fullNav.classList.add("show");
    };
    // Private Null
    Navigation.prototype.addEventListeners = function () {
        var _this = this;
        this.hamburger.links.forEach(function (link) {
            // link.node.addEventListener("click", () => {
            //     this.handleMouseOverHamburger(link);
            // })
            // link.node.addEventListener("mouseleave", () => {
            //     this.handleMouseLeaveHamburger(link);
            // })
            // if (link.hasChildren) {
            //     link.mobileIcon.node.addEventListener("click", () => {
            //         this.handleExpandSubMenuButton(link);
            //     })
            // }
        });
        // this.topNav.links.forEach(link => {
        //     link.node.addEventListener("click", () => {
        //         this.handleMouseOverNav(link)
        //     })
        // link.node.addEventListener("mouseleave", () => {
        //     this.handleMouseLeaveNav(link)
        // })
        // })
        this.hamburgerButton.addEventListener("click", function (e) {
            _this.handleHamburgerButton();
        });
        window.addEventListener("click", function (e) {
            _this.handlePageClick(e);
        });
    };
    return Navigation;
}());
exports.default = Navigation;


/***/ }),

/***/ "./src/classes/Video.ts":
/*!******************************!*\
  !*** ./src/classes/Video.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/index.js"));
var Video = /** @class */ (function () {
    function Video(node, page) {
        this.videoDetails = {
            thumbnail: "",
            height: null,
            width: null
        };
        this.node = node;
        this.page = page;
        this.getVideo();
    }
    Video.prototype.getVideo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.getURL();
                        this.getUrlDomain();
                        return [4 /*yield*/, this.getVideoDetails()];
                    case 1:
                        _a.sent();
                        this.getUrlSlug();
                        params = new URLSearchParams(window.location.search);
                        if (params.has("v")) {
                            this.createVideoDiv();
                        }
                        else {
                            this.createThumbnail();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Video.prototype.getURL = function () {
        if (this.node.dataset.url) {
            this.url = this.node.dataset.url;
        }
        else {
            return;
        }
    };
    Video.prototype.getUrlDomain = function () {
        var _this = this;
        var domains = [
            "youtube.com",
            "vimeo.com"
        ];
        this.domain = domains.find(function (d) {
            return _this.url.includes(d);
        });
    };
    Video.prototype.getUrlSlug = function () {
        if (this.node.dataset.slug) {
            this.slug = this.node.dataset.slug;
        }
        else {
        }
    };
    Video.prototype.formatVideoURL = function () {
        switch (this.domain) {
            case "youtube.com":
                var youtubeSplit = this.url.split("?v=");
                var youtubeVideoID = youtubeSplit[youtubeSplit.length - 1];
                return "https://youtube.com/embed/" + youtubeVideoID;
            case "vimeo.com":
                var urlSplit = this.url.split("/");
                var videoID = "";
                for (var i = urlSplit.length - 1; i >= 0; i--) {
                    var element = urlSplit[i];
                    if (element) {
                        videoID = element;
                        break;
                    }
                }
                return "https://player.vimeo.com/video/" + videoID;
            default:
                throw new Error("What");
        }
    };
    Video.prototype.getIFrame = function () {
        var url = this.formatVideoURL();
        switch (this.domain) {
            case "youtube.com":
                return ("<iframe \n                        src=" + url + "\n                        title=\"YouTube video player\" \n                        frameBorder=\"0\" \n                        allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" \n                        allowFullScreen>\n                    </iframe>");
            case "vimeo.com":
                return ("<iframe \n                        src=" + url + "\n                        frameBorder=\"0\" \n                        allow=\"autoplay; fullscreen; picture-in-picture\" \n                        allowFullScreen>\n                    </iframe>");
            default:
                console.error("Unknown video type");
        }
    };
    Video.prototype.createVideoDiv = function () {
        var iframe = this.getIFrame();
        var iframeWrapper = document.createElement("div");
        iframeWrapper.classList.value = "c-talk__video-wrapper";
        iframeWrapper.innerHTML = iframe;
        this.node.classList.value = "c-talk__video";
        this.node.style.display = "block";
        this.node.appendChild(iframeWrapper);
        var params = new URLSearchParams(window.location.search);
        if (!params.has("v")) {
            var link = document.createElement("a");
            link.classList.value = "c-talk__video-link";
            var linkSlug = this.page + "?v=" + this.slug;
            link.href = linkSlug;
            this.node.appendChild(link);
        }
    };
    Video.prototype.getVideoDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var urlSpl, id, details;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.domain == "vimeo.com")) return [3 /*break*/, 2];
                        urlSpl = this.url.split("/");
                        id = urlSpl[urlSpl.length - 1];
                        return [4 /*yield*/, axios_1.default.get("https://vimeo.com/api/v2/video/" + id + ".json")];
                    case 1:
                        details = _a.sent();
                        this.videoDetails.thumbnail = details.data[0].thumbnail_large;
                        this.videoDetails.height = details.data.height;
                        this.videoDetails.width = details.data.width;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Video.prototype.createThumbnail = function () {
        if (this.videoDetails.thumbnail) {
            var thumbNail = document.createElement("img");
            thumbNail.src = this.videoDetails.thumbnail;
            thumbNail.classList.add("c-video__thumbnail");
            this.node.appendChild(thumbNail);
            this.node.classList.value = "c-talk__thumbnail";
            this.node.style.display = "block";
            var link = document.createElement("a");
            link.classList.value = "c-talk__video-link";
            var linkSlug = this.page + "?v=" + this.slug;
            link.href = linkSlug;
            this.node.appendChild(link);
        }
        else {
            this.createVideoDiv();
        }
    };
    return Video;
}());
exports.default = Video;


/***/ }),

/***/ "./src/dynamicNav.ts":
/*!***************************!*\
  !*** ./src/dynamicNav.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Navigation_1 = __importDefault(__webpack_require__(/*! ./classes/Navigation */ "./src/classes/Navigation.ts"));
var implementNav = function () {
    var navigationItems = document.getElementsByClassName("navigation");
    var navigationArray = [];
    for (var i = 0; i < navigationItems.length; i++) {
        var nav = navigationItems[i];
        var navigation = new Navigation_1.default(nav, { "Abstract Submission": "Abstract", "Scientific Committee": "Science" });
        navigationArray = __spreadArray(__spreadArray([], __read(navigationArray)), [navigation]);
    }
    if (navigationArray) {
        window.addEventListener("DOMContentLoaded", function () {
            navigationArray.forEach(function (nav) {
                nav.handleResize();
            });
            setTimeout(function () {
                navigationArray.forEach(function (nav) {
                    nav.show();
                });
            }, 20);
        });
        window.addEventListener("resize", function () {
            navigationArray.forEach(function (nav) {
                nav.handleResize();
            });
        });
    }
};
exports.default = implementNav;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var dynamicNav_1 = __importDefault(__webpack_require__(/*! ./dynamicNav */ "./src/dynamicNav.ts"));
var previewImage_1 = __webpack_require__(/*! ./previewImage */ "./src/previewImage.js");
var wordCounter_1 = __webpack_require__(/*! ./wordCounter */ "./src/wordCounter.js");
__webpack_require__(/*! ./videos */ "./src/videos.ts");
dynamicNav_1.default();
previewImage_1.implementPreviewImage();
wordCounter_1.implementWordCount();


/***/ }),

/***/ "./src/videos.ts":
/*!***********************!*\
  !*** ./src/videos.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Video_1 = __importDefault(__webpack_require__(/*! ./classes/Video */ "./src/classes/Video.ts"));
var videos = Array.from(document.getElementsByClassName("c-talk__URL"));
videos.forEach(function (v) {
    var relativePath = window.location.pathname;
    if (relativePath.includes("index.php")) {
        relativePath = relativePath.split("index.php")[0];
    }
    new Video_1.default(v, relativePath);
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map