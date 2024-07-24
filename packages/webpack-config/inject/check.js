/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-cond-assign */
/* eslint-disable one-var */
/* eslint-disable no-var */
typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object' &&
  (window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {})

function getBrowserTypeAndVersion() {
  var e,
    r = navigator.userAgent.toLowerCase()
  return (r.indexOf('compatible') > -1 && r.indexOf('MSIE') > -1) ||
    (r.indexOf('Trident') > -1 && r.indexOf('rv:11.0') > -1)
    ? { name: 'IE', version: '' }
    : (e = r.match(/edge\/([\d\.]+)/))
    ? { name: 'Edge', version: e[1] }
    : (e = r.match(/firefox\/([\d\.]+)/))
    ? { name: 'Firefox', version: e[1] }
    : (e = r.match(/chrome\/([\d\.]+)/))
    ? { name: 'Chrome', version: e[1] }
    : (e = r.match(/version\/([\d\.]+).*safari/))
    ? { name: 'Safari', version: e[1] }
    : { name: 'unknown', version: '' }
}
function compareVersion(e, r) {
  for (var n = e.split('.'), o = r.split('.'), t = Math.max(n.length, o.length); n.length < t; ) n.push('0')
  for (; o.length < t; ) o.push('0')
  for (var s = 0; s < t; s++) {
    var i = parseInt(n[s]),
      a = parseInt(o[s])
    if (i >= a) return 1
    if (i < a) return -1
  }
  return 0
}
const browserInfo = getBrowserTypeAndVersion()
if (browserInfo.name === 'IE') {
  document.getElementById('protect-browser').innerText =
    'Sorry, this site does not support Internet Explorer. In order to avoid affecting the normal use of our features, please use a more modern browser such as Edge, Firefox, Chrome, or Safari.'
} else {
  if (
    window.defaultList.some((e) => e.name === browserInfo.name && compareVersion(browserInfo.version, e.version) === -1)
  ) {
    document.getElementById('protect-browser').innerText =
      'The current browser version is too low, in order not to affect the normal use of the function, please upgrade the browser to the latest version.'
  }
}
