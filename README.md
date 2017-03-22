# bertha-client [![CircleCI](https://circleci.com/gh/Financial-Times/bertha-client.svg?style=svg)](https://circleci.com/gh/Financial-Times/bertha-client) [![npm](https://img.shields.io/npm/v/bertha-client.svg)](https://npmjs.com/package/bertha-client)

A client library for fetching data from [Bertha](https://github.com/ft-interactive/bertha). For use in Node and the browser.

Why use this instead of fetching Bertha URLs with `fetch` or `axios`?

- takes care of the URL syntax
- gives more helpful error messages when things go wrong
- provides an easy way to transform sheets into objects

## Installation

- `yarn add bertha-client` **or** `npm install bertha-client`

**Browser**: Use Browserify or Rollup. Requires [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch), so make sure this is [polyfilled](https://cdn.polyfill.io/v2/docs/features/#fetch).

**Node**: Just `require` or `import` as usual. No need to polyfill anything – the Node version of bertha-client uses [node-fetch](https://github.com/bitinn/node-fetch) internally.

## Usage

```js
import bertha from 'bertha-client'; // or const bertha = require('bertha-client');

bertha.get(spreadsheetKey, ['someSheet', 'anotherSheet|object']).then((data) => {
  console.log(data);
  // { someSheet: [...], anotherSheet: [...] }
});
```

## API

Currently there is just one method.

### bertha.get(spreadsheetKey, sheetNames, [options])

Fetches the sheet and returns a promise for the response data.

##### spreadsheetKey

String (required). A valid Google spreadsheet key, or a full Google Spreadsheet URL or Bertha URL.

##### sheetNames

Array of strings (required). The names of the sheets you want to get. A sheet name may be appended with `|object` to apply the "object" transformation.

```js
// example
const sheetNames = [
  'polls',
  'authors',
  'copy|object', // applies the "object" transformation
]
```

##### `options`

Plain object (optional).

- `republish` (default: false) – set to `true` if you want Bertha to trigger a republish.

## Response data

The data is always returned a plain JavaScript object (not an array). The key names correspond with the sheet names.

### The `|object` transformation

If you append a sheet name with `|object`, that sheet will be transformed into a **plain object** (instead of an array), using the sheet's `name` and `value` columns as the keys and values of the object, respectively. Any other columns are discarded.

Example:

| name | value |
| ---- | ----- |
| foo  | hiya  |
| bar  | 123   |

```js
{
  foo: 'hiya',
  bar: '123',
}
```


## Development

### Local setup

Recommended approach: clone this repo and run `yarn`.

Then run `yarn run build -- --watch` – this will continually compile `src` to `dist`.

In another terminal, run `yarn run test -- --watch` – this will run eslint then flow then ava, and it will continue running ava when files change.


### Publishing to npm

bertha-client is automatically published to npm via CircleCI whenever the master branch contains a higher version string than the latest published version.

To publish a new version:

- `npm version patch` (or `npm version minor` or `npm version major` as appropriate)
- `git push && git push --tags`
