# bertha-client [![CircleCI](https://circleci.com/gh/Financial-Times/bertha-client.svg?style=svg)](https://circleci.com/gh/Financial-Times/bertha-client) [![npm](https://img.shields.io/npm/v/bertha-client.svg)](https://npmjs.com/package/bertha-client)

A client library for fetching data from [Bertha](https://github.com/ft-interactive/bertha).

Why use this instead of fetching Bertha URLs with `fetch` or `axios`?

- takes care of the URL syntax
- gives more helpful error messages when things go wrong
- provides an easy way to transform sheets into objects


## Installation

- `yarn add bertha-client` **or** `npm install bertha-client`

## Usage

```js
import * as bertha from 'bertha-client'; // or const bertha = require('bertha-client');

bertha.get(spreadsheetKey, ['someSheet', 'anotherSheet|object']).then((data) => {
  console.log(data);
  // { someSheet: [...], anotherSheet: [...] }
});
```


## API

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
- `query` (default: undefined) – an optional object of `{[name]: value}` to append to the URL as query parameters.

### bertha.createURL(spreadsheetKey, sheetNames, [options])

Identical API to `bertha.get()`, but simply returns a URL string.

### new bertha.Poller(spreadsheetKey, sheetNames, [options])

Inspired by [ft-poller](https://github.com/Financial-Times/ft-poller) (but with a simpler API), this constructs a poller that fetches the data once a minute. When you call `poller.get()`, it resolves almost immediately (apart from the first time).

Constructor takes same arguments as `bertha.get()`, except that `options` may additionally include the following:

- `refreshInterval` (default: `60000`) – the number of milliseconds between refreshes. Minimum 1000.

#### poller.get()

Returns a promise of the latest available data. Resolves immediately with the latest data if available, i.e. after the first successful fetch.

#### poller.stop()

Stops any new fetches from occurring (but any in-progress fetch will finish).

### bertha.parseKey(url, [silent])

Takes any valid Google Sheets URL or Bertha URL and returns a plain spreadsheet key. If the string you pass is already a plain key, it returns it unchanged.

If you set `silent` to `true`, invalid input will result in the function returning `null` instead of throwing an error.

### bertha.domains

An array of known Bertha domains.

## Response data

The data from `bertha.get()` is always returned as a plain JavaScript object (even if there is only one sheet). The key names correspond with the sheet names.

### The `|object` transformation

If you append a sheet name with `|object`, that sheet will be transformed into a **plain object** (instead of an array), using the sheet's `name` and `value` columns as key paths and values, respectively. Any other columns are discarded. If the `name` or `value` columns are missing, an error is thrown.

Example spreadsheet:

| name               | value   |
| ------------------ | ------- |
| foo                | hiya    |
| bar                | 123     |
| someone.age        | 50      |
| someone.name.first | Bob     |
| someone.name.last  | Hoskins |

```js
// result of "|object" transform
{
  foo: 'hiya',
  bar: 123,
  someone: {
    age: 50,
    name: {
      first: 'Bob',
      last: 'Hoskins',
    }
  },
}
```

> NB. the Bertha server automatically converts certain values (`"y"` or `"yes"` becomes `true` etc.) – see [Bertha's docs](https://github.com/ft-interactive/bertha/wiki/Tutorial#standard-transforms). This conversion is not controlled by bertha-client – you'll need to specify a non-default column transform such as `..str` if you want to control it.


## Development

### Local setup

Recommended approach:

- Clone this repo and run `npm install`.
- Run `npm run build -- --watch` – this will compile files continually from `src` to `dist` using Babel.
- In another terminal, run `npm test -- --watch` to run Jest continually against files in `dist`.


### Publishing to npm

This module is automatically published to npm via CircleCI whenever the master branch contains a higher version string than the latest published version.

To publish a new version:

- `npm version patch` (or replace `patch` with `minor` or `major` as appropriate)
- `git push && git push --tags`
