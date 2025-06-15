const assert = require('assert');
const wayfarer = require('@pirxpilot/wayfarer');

module.exports = nanorouter;

// electron support
const isLocalFile = /file:\/\//.test(typeof window === 'object' && window.location && window.location.origin);

const stripElectron = /^(file:\/\/|\/)(.*\.html?\/?)?/;
const prefix = /^(http(s)?(:\/\/))?(www\.)?[a-zA-Z0-9-_.]+(:[0-9]{1,5})?(\/{1})?/;
const normalize = /#/;
const suffix = /'[?].*$'/;

function nanorouter(opts = {}) {
  const router = wayfarer(opts.default || '/404');

  return {
    on,
    emit,
    match
  };

  function on(routename, listener) {
    assert(typeof routename === 'string');
    routename = routename.replace(/^[#/]/, '');
    router.on(routename, listener);
  }

  function emit(routename) {
    assert(typeof routename === 'string');
    routename = pathname(routename, isLocalFile);
    return router.emit(routename);
  }

  function match(routename) {
    assert(typeof routename === 'string');
    routename = pathname(routename, isLocalFile);
    return router.match(routename);
  }
}

// replace everything in a route but the pathname and hash
function pathname(routename, isElectron) {
  if (isElectron) routename = routename.replace(stripElectron, '');
  else routename = routename.replace(prefix, '');
  return decodeURI(routename.replace(suffix, '').replace(normalize, '/'));
}
