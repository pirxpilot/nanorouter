[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]
# @pirxpilot/nanorouter

Fork of [nanorouter].
Smol frontend router

## Usage
```js
var nanorouter = require('@pirxpilot/nanorouter')
var router = nanorouter({ default: '/404' })

router.on('/foo', function (params) {
  console.log('hit /foo')
})
router.on('/foo/:bar', function (params) {
  console.log('hit a route with params', params.bar)
})
router.on('/foo#baz', function (params) {
  console.log('we do hash routes too!')
})
router.on('/foo/*', function (params) {
  console.log('and even wildcards', params.wildcard)
})

router.emit('/foo/hello-planet')
```

## FAQ
### How is this different from sheet-router?
`sheet-router` does slightly more and has a different syntax. This router is
lighter, faster and covers less concerns. They're pretty similar under the hood
though.

## API
### `router = nanorouter([opts])`
Create a new router. `opts` can be:
- __opts.default:__ set a default handler in case no route matches. Defaults to
  `/404`

### `router.on(routename, handler(params))`
Register a handler on a routename. The handler receives an object with params
on each render. A result can be `return`ed the caller function.

### `result = router.emit(routename)`
Call a handler for a `routename`. If no handler matches, the handler specified
in `opts.default` will be called. If no default handler matches, an error will
be thrown. Results returned from the called handler will be returned from this
function.

### `matchedRoute = router.match(route)`
Matches a route and returns an object. The returned object contains the properties `{cb, params, route}`. This method does not invoke the callback of a route. If no route matches, the route specified in `opts.default` will be returned. If no default route matches, an error will be thrown.

Note that `router()` does not affect browser history. If you would like to
add or modify history entries when you change routes, you should use
[`history.pushState()` and `history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries)
alongside `router()`.

## See Also
- [yoshuawuyts/sheet-router](https://github.com/yoshuawuyts/sheet-router)
- [yoshuawuyts/wayfarer](https://github.com/yoshuawuyts/wayfarer)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[nanorouter]: https://npmjs.org/package/nanorouter

[npm-image]: https://img.shields.io/npm/v/@pirxpilot/nanorouter
[npm-url]: https://npmjs.org/package/@pirxpilot/nanorouter

[build-url]: https://github.com/pirxpilot/nanorouter/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/workflow/status/pirxpilot/nanorouter/check

[deps-image]: https://img.shields.io/librariesio/release/npm/@pirxpilot/nanorouter
[deps-url]: https://libraries.io/npm/@pirxpilot%2Fnanorouter
