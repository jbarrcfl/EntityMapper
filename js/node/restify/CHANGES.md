# restify Changelog

## 2.3.5 (not yet released)

## 2.3.4

- GH-343 default to 'identity' for accept-encoding
- GH-342 client support for PATCH
- Pick up spdy@1.4.6 (doesn't ship all the example garbage)

## 2.3.3

- Stop logging client_req in bunyan output
- GH-319 make DTrace optional
- GH-335 Content-Type'd routes not accepting array (Pedro Palazón)

## 2.3.2

- pick up bunyan 0.18.3
- server.address() returning null causes server.url to deref null

## 2.3.1

- GH-335 Content-Type'd routes not correct when only Accept-Extension varies,
         part deux (switch to `negotiator`, drop `mimeparse`).

## 2.3.0

- GH-335 Content-Type'd routes not correct when only Accept-Extension varies
- GH-332 Cache-Control max-age should show minutes (Ben Hutchison)
- GH-329 Wrong values in res.methods on some cases
- GH-327 server.versionedUse('1.2.3', function (req, res, next) {}) (Tim Kuijsten)
- GH-326 non-default origins not working, Chrome requires allow/origin and
         allow users to append to CORS array (John Fieber/Damon Oehlman)
- GH-323 <path>/?<querystring> broken
- GH-322 add `req.route`, which contains the original params for the
         route (Tim Kuijsten)
- GH-312 bodyParser() should return buffers when data is binary (Tim Kuijsten)
- GH-318 Allow use of 'requestBodyOnGet' option in bodyParser (@geebee)

## 2.2.1

- GH-283 broke versioned, typed routes. Fix.
- node-http-signature@0.9.11

## 2.2.0

- GH-316 drop `clone`, and just shallow copy (Trent Mick)
- GH-284 preflight requests not working without access-control-request-headers
- GH-283 versioned routes should use maximum match, not first (Colin O'Brien)
- dtrace probes for restify clients
- node-dtrace-provider@0.2.8
- backoff@2.0.0 and necessary changes

## 2.1.1

- revert to backoff@1.2.0

## 2.1.0

- GH-284 built-in CORS
- GH-290 next.ifError
- GH-291 fix overwriting `options.type` in createJSONClient (Trent Mick)
- GH-297 default document serving in static plugin (Adam Argo)
- GH-299 gzip plugin doesn't play nice with content-length (Ben Hale)
- GH-301 support private keys w/passphrase (Erik Kristensen)
- GH-302 responseTime cleanup
- Move to `node-backoff` and rework retry logic in HttpClient
- Support keep-alive by default in HttpClient

## 2.0.4

- GH-280 req.params cached by router
- RequestCaptureStream should support outputting to multiple streams
- Default uncaughtException handler should check if headers have been sent

## 2.0.2/2.0.3

- GH-278 missing events on route errors
- Undo `RestError` `constructorOpt` from 2.0.1

## 2.0.1

- GH-269 plugin to make curl happy
- RestError not honoring `constructorOpt` from `cause`
- GH-271 bump to dtrace 0.2.6 (fix build on Mountain Lion)

# Legacy Releases

## 1.4.2

- logging typo (Pedro Candel)
- response `beforeSend` event (Paul Bouzakis)

## 1.4.1

- GH-130 Allow restify and express to coexist.
- GH-129 format HttpErrors as well as RestErrors (Domenic Denicola)
- GH-127 add absolute uri to request (Paul Bouzakis)
- GH-124 `req.query` is `undefined` if no query string was sent
- GH-123 Generated DTrace probe names should be valid
- GH-122 Response._writeHead can cause infinite loop (Trent Mick)
- GH-120 Allow server.patch (Paul Bouzakis)
- GH-119 defaultResponseHeaders not settable
- GH-113 document `return next(false)`


## 1.4.0

- GH-116 More friendly error objects (Domenic Denicola)
- GH-115 Client hangs on server "hard kills" (i.e., RST)
- GH-111 JSON parser only works on objects (not arrays)
- GH-110 emit expectContinue (Paul Bouzakis)
- Fix "undefined" log message in string_client.js
- GH-107
  - Go back to hacking up http.prototype for performance reasons
  - Default to keep-alive on for HTTP/1.1 requests
  - Misc fixes after refactoring.
- GH-109 routes not honoring regex flags.
- GH-108 server missing `listening` event.
- Audit logger optionally logs request/response bodies
- Require http-signature@0.9.9/ctype@0.5.0 (node 0.7 compatible)

## 1.3.0

- GH-100 Make DTrace an optional dependency, and stub it out if not found.
- res.link API not allowing sprintf style sets.
- Support for `socketPath` in client API (alternative to url).
- OPTIONS api not returning access-control-allow-methods header (Steve Mason).
- Allow null passwords in HTTP basic auth (Andrew Robinson).
- set `req.files` on multipart file uploads (Andrew Robinson).

## 1.2.0

- Don't rely on instanceof checks for Errors in response.
- Change route.run log level from trace to debug on next(err).
- Add `res.link` API (wrap up sending a Link: response header).
- GH-98 req.secure needs to return a boolean, not an object
- GH-97 Malformed URI results in server crash
- GH-94 leverage `qs` module for object notation in query string.

## 1.1.1

- dependency version bumps
- res.header accepts sprintf-style arguments
- GH-95 Make restify compatible with node-logging (Andrew Robinson)
- GH-93 Minimal port of express pre-conditions (Dominic Barnes)
- GH-92 Make X-Response-Time configurable (Shaun Berryman)
- GH-87 server.listen on port as string (Andrew Sliwinski)

## 1.1.0

- GH-86 Bunyan version bump.
- Conditional Request plugin tests and fixes for some errors (Mike Williams).
- GH-83 pluggable storage engine for throttling, and LRU for default engine.
- GH-77 `server.on('uncaughtException', function (req, res, route, err) {});`
- GH-79 Docs typo(s).

## 1.0.1

- Version bump bunyan to 0.6.4.


## 1.0.0

- Makefile restructure (use Joyent templates)
- GH-20 HttpClient connectTimeout.
- Allow parser plugins to allow "override" params
- Proper handling of Expect: 100
- multipart/form-data plugin
- Added a 'header' event on res.writeHead
- GH-72 Wrong server name in response header on 404/405/...
- RegExp mounts throw a TypeError
- Allow pre handlers to update request url
- try/catch around route running
- Bundled audit logger (via bunyan)
- strict adherence to RFC3986 for URL encoding
- range versioning changed to be an array of explicit versions
- Switch from log4js to [bunyan](https://github.com/trentm/node-bunyan)
- Official version of `ConditionalRequest` plugin (Falco Nogatz)
- order formatters on response such that JSON/text are before custom ones
- RestErrors can use format strings
- date plugin has bad log check


## 1.0.0-rc2

- GH-66 Support for charSets in responses
- GH-65 Initial version of etag plugin (Falco Nogatz)
- GH-68 res.header() can serialize Date objects to RFC1123
- GH-67 Set some default response headers earlier (access-control-*)
- http-client should auto insert the date header
- GH-64 Support for a pre-routing chain
- JsonClient should "upcast" errors to RestErrors if it can
- GH-63 res.send(204) returning a body of 204
- GH-61 Make bodyParser merging into req.params optional
- Make Error objects backwards compatible with older restify (httpCode/restCode)
- GH-57, GH-62 range versioning on server (Diego Torres)
- GH-59 routes with just '/' are returning 404
- DTrace *-done actually firing content-length (was always 0)
- [Issue 56] Support streaming downloads
- Modify server.on('after') to emit the `Route` object, rather than the name.

## 1.0.0-rc1

(Started maintaining this log 21 January 2012. For earlier change information
you'll have to dig into the commit history.)
