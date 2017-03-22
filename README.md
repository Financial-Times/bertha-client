# bertha-client

A client library for fetching data from [Bertha](https://github.com/ft-interactive/bertha). Suitable for both clientside and serverside.

Why use this instead of fetching Bertha URLs yourself?

- takes care of the URL syntax
- gives more helpful error messages when things go wrong
- provides an easy way to transform certain sheets into objects

## Installation

- `yarn add bertha-client`
- `npm install bertha-client`

#### Browser

Use Browserify or Rollup. Requires [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch), so make sure this is [polyfilled](https://cdn.polyfill.io/v2/docs/features/#fetch).

#### Node

Just `require` or `import` as usual. No need to polyfill anything. The Node version uses node-fetch internally (without modifying the global scope).

## Usage

```js
import bertha from 'bertha-client'; // or const bertha = require('bertha-client');

bertha.get(sheetKey, ['someSheet', 'anotherSheet|object']).then((data) => {
  console.log(data);
  // { someSheet: [...], anotherSheet: [...] }
});
```

## API

Currently there is just one method.

### bertha.get(sheetKey, sheetNames, [options])

Fetches the sheet and returns a promise for the response data.

##### sheetKey

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
