;(() => {
  // webpackBootstrap
  'use strict'
  var __webpack_modules__ = {}
  /************************************************************************/
  // The module cache
  var __webpack_module_cache__ = {}

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId]
    if (cachedModule !== undefined) {
      return cachedModule.exports
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      id: moduleId,
      // no module.loaded needed
      exports: {},
    })

    // Execute the module function
    var execOptions = {
      id: moduleId,
      module: module,
      factory: __webpack_modules__[moduleId],
      require: __webpack_require__,
    }
    __webpack_require__.i.forEach(function (handler) {
      handler(execOptions)
    })
    module = execOptions.module
    execOptions.factory.call(module.exports, module, module.exports, execOptions.require)

    // Return the exports of the module
    return module.exports
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = __webpack_modules__

  // expose the module cache
  __webpack_require__.c = __webpack_module_cache__

  // expose the module execution interceptor
  __webpack_require__.i = []

  /************************************************************************/
  /* webpack/runtime/async module */
  ;(() => {
    var webpackQueues = typeof Symbol === 'function' ? Symbol('webpack queues') : '__webpack_queues__'
    var webpackExports = typeof Symbol === 'function' ? Symbol('webpack exports') : '__webpack_exports__'
    var webpackError = typeof Symbol === 'function' ? Symbol('webpack error') : '__webpack_error__'
    var resolveQueue = (queue) => {
      if (queue && queue.d < 1) {
        queue.d = 1
        queue.forEach((fn) => fn.r--)
        queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()))
      }
    }
    var wrapDeps = (deps) =>
      deps.map((dep) => {
        if (dep !== null && typeof dep === 'object') {
          if (dep[webpackQueues]) return dep
          if (dep.then) {
            var queue = []
            queue.d = 0
            dep.then(
              (r) => {
                obj[webpackExports] = r
                resolveQueue(queue)
              },
              (e) => {
                obj[webpackError] = e
                resolveQueue(queue)
              }
            )
            var obj = {}
            obj[webpackQueues] = (fn) => fn(queue)
            return obj
          }
        }
        var ret = {}
        ret[webpackQueues] = (x) => {}
        ret[webpackExports] = dep
        return ret
      })
    __webpack_require__.a = (module, body, hasAwait) => {
      var queue
      hasAwait && ((queue = []).d = -1)
      var depQueues = new Set()
      var exports = module.exports
      var currentDeps
      var outerResolve
      var reject
      var promise = new Promise((resolve, rej) => {
        reject = rej
        outerResolve = resolve
      })
      promise[webpackExports] = exports
      promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise['catch']((x) => {}))
      module.exports = promise
      body(
        (deps) => {
          currentDeps = wrapDeps(deps)
          var fn
          var getResult = () =>
            currentDeps.map((d) => {
              if (d[webpackError]) throw d[webpackError]
              return d[webpackExports]
            })
          var promise = new Promise((resolve) => {
            fn = () => resolve(getResult)
            fn.r = 0
            var fnQueue = (q) =>
              q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn)))
            currentDeps.map((dep) => dep[webpackQueues](fnQueue))
          })
          return fn.r ? promise : getResult()
        },
        (err) => (err ? reject((promise[webpackError] = err)) : outerResolve(exports), resolveQueue(queue))
      )
      queue && queue.d < 0 && (queue.d = 0)
    }
  })()

  /* webpack/runtime/chunk loaded */
  ;(() => {
    var deferred = []
    __webpack_require__.O = (result, chunkIds, fn, priority) => {
      if (chunkIds) {
        priority = priority || 0
        for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1]
        deferred[i] = [chunkIds, fn, priority]
        return
      }
      var notFulfilled = Infinity
      for (var i = 0; i < deferred.length; i++) {
        var [chunkIds, fn, priority] = deferred[i]
        var fulfilled = true
        for (var j = 0; j < chunkIds.length; j++) {
          if (
            (priority & (1 === 0) || notFulfilled >= priority) &&
            Object.keys(__webpack_require__.O).every((key) => __webpack_require__.O[key](chunkIds[j]))
          ) {
            chunkIds.splice(j--, 1)
          } else {
            fulfilled = false
            if (priority < notFulfilled) notFulfilled = priority
          }
        }
        if (fulfilled) {
          deferred.splice(i--, 1)
          var r = fn()
          if (r !== undefined) result = r
        }
      }
      return result
    }
  })()

  /* webpack/runtime/compat get default export */
  ;(() => {
    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = (module) => {
      var getter = module && module.__esModule ? () => module['default'] : () => module
      __webpack_require__.d(getter, { a: getter })
      return getter
    }
  })()

  /* webpack/runtime/define property getters */
  ;(() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
        }
      }
    }
  })()

  /* webpack/runtime/global */
  ;(() => {
    __webpack_require__.g = (function () {
      if (typeof globalThis === 'object') return globalThis
      try {
        return this || new Function('return this')()
      } catch (e) {
        if (typeof window === 'object') return window
      }
    })()
  })()

  /* webpack/runtime/hasOwnProperty shorthand */
  ;(() => {
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
  })()

  /* webpack/runtime/load script */
  ;(() => {
    var inProgress = {}
    var dataWebpackPrefix = 'example-webpack-react:'
    // loadScript function to load a script via script tag
    __webpack_require__.l = (url, done, key, chunkId) => {
      if (inProgress[url]) {
        inProgress[url].push(done)
        return
      }
      var script, needAttach
      if (key !== undefined) {
        var scripts = document.getElementsByTagName('script')
        for (var i = 0; i < scripts.length; i++) {
          var s = scripts[i]
          if (s.getAttribute('src') == url || s.getAttribute('data-webpack') == dataWebpackPrefix + key) {
            script = s
            break
          }
        }
      }
      if (!script) {
        needAttach = true
        script = document.createElement('script')

        script.charset = 'utf-8'
        script.timeout = 120
        if (__webpack_require__.nc) {
          script.setAttribute('nonce', __webpack_require__.nc)
        }
        script.setAttribute('data-webpack', dataWebpackPrefix + key)

        script.src = url
      }
      inProgress[url] = [done]
      var onScriptComplete = (prev, event) => {
        // avoid mem leaks in IE.
        script.onerror = script.onload = null
        clearTimeout(timeout)
        var doneFns = inProgress[url]
        delete inProgress[url]
        script.parentNode && script.parentNode.removeChild(script)
        doneFns && doneFns.forEach((fn) => fn(event))
        if (prev) return prev(event)
      }
      var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000)
      script.onerror = onScriptComplete.bind(null, script.onerror)
      script.onload = onScriptComplete.bind(null, script.onload)
      needAttach && document.head.appendChild(script)
    }
  })()

  /* webpack/runtime/react refresh */
  ;(() => {
    __webpack_require__.i.push((options) => {
      const originalFactory = options.factory
      options.factory = function (moduleObject, moduleExports, webpackRequire) {
        __webpack_require__.$Refresh$.setup(options.id)
        try {
          originalFactory.call(this, moduleObject, moduleExports, webpackRequire)
        } finally {
          if (typeof Promise !== 'undefined' && moduleObject.exports instanceof Promise) {
            options.module.exports = options.module.exports.then(
              (result) => {
                __webpack_require__.$Refresh$.cleanup(options.id)
                return result
              },
              (reason) => {
                __webpack_require__.$Refresh$.cleanup(options.id)
                return Promise.reject(reason)
              }
            )
          } else {
            __webpack_require__.$Refresh$.cleanup(options.id)
          }
        }
      }
    })

    __webpack_require__.$Refresh$ = {
      register: () => undefined,
      signature: () => (type) => type,
      runtime: {
        createSignatureFunctionForTransform: () => (type) => type,
        register: () => undefined,
      },
      setup: (currentModuleId) => {
        const prevModuleId = __webpack_require__.$Refresh$.moduleId
        const prevRegister = __webpack_require__.$Refresh$.register
        const prevSignature = __webpack_require__.$Refresh$.signature
        const prevCleanup = __webpack_require__.$Refresh$.cleanup

        __webpack_require__.$Refresh$.moduleId = currentModuleId

        __webpack_require__.$Refresh$.register = (type, id) => {
          const typeId = currentModuleId + ' ' + id
          __webpack_require__.$Refresh$.runtime.register(type, typeId)
        }

        __webpack_require__.$Refresh$.signature = () =>
          __webpack_require__.$Refresh$.runtime.createSignatureFunctionForTransform()

        __webpack_require__.$Refresh$.cleanup = (cleanupModuleId) => {
          if (currentModuleId === cleanupModuleId) {
            __webpack_require__.$Refresh$.moduleId = prevModuleId
            __webpack_require__.$Refresh$.register = prevRegister
            __webpack_require__.$Refresh$.signature = prevSignature
            __webpack_require__.$Refresh$.cleanup = prevCleanup
          }
        }
      },
    }
  })()

  /* webpack/runtime/jsonp chunk loading */
  ;(() => {
    // no baseURI

    // object to store loaded and loading chunks
    // undefined = chunk not loaded, null = chunk preloaded/prefetched
    // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
    var installedChunks = {
      'runtime~main': 0,
    }

    // no chunk on demand loading

    // no prefetching

    // no preloaded

    // no HMR

    // no HMR manifest

    __webpack_require__.O.j = (chunkId) => installedChunks[chunkId] === 0

    // install a JSONP callback for chunk loading
    var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
      var [chunkIds, moreModules, runtime] = data
      // add "moreModules" to the modules object,
      // then flag all "chunkIds" as loaded and fire callback
      var moduleId,
        chunkId,
        i = 0
      if (chunkIds.some((id) => installedChunks[id] !== 0)) {
        for (moduleId in moreModules) {
          if (__webpack_require__.o(moreModules, moduleId)) {
            __webpack_require__.m[moduleId] = moreModules[moduleId]
          }
        }
        if (runtime) var result = runtime(__webpack_require__)
      }
      if (parentChunkLoadingFunction) parentChunkLoadingFunction(data)
      for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i]
        if (__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
          installedChunks[chunkId][0]()
        }
        installedChunks[chunkId] = 0
      }
      return __webpack_require__.O(result)
    }

    var chunkLoadingGlobal = (self['webpackChunkexample_webpack_react'] =
      self['webpackChunkexample_webpack_react'] || [])
    chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0))
    chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal))
  })()

  /* webpack/runtime/nonce */
  ;(() => {
    __webpack_require__.nc = undefined
  })()

  /************************************************************************/

  // module cache are used so entry inlining is disabled
})()
