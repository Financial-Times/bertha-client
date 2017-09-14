// @flow

import domains from './domains'

const spreadsheetKeyRegex = /^[a-zA-Z0-9\-_]{30,60}$/

const parseKey = (string: string, silent: boolean = false) => {
  if (string.indexOf('http') === 0) {
    // attempt to parse as a google url
    if (string.indexOf('https://docs.google.com') === 0) {
      if (string.indexOf('?key=') === -1) {
        // it's a new-style url.
        return string
          .split(/\/spreadsheets\/[^/]+\//)
          .pop()
          .split('/')[0]
          .split('?')[0]
          .split('#')[0]
      }

      // it's an old-style url.
      return string
        .split('key=')
        .pop()
        .split('&')[0]
        .split('#')[0]
    }

    // attempt to parse as a bertha url
    const afterProtocol = string.split('//')[1]
    if (domains.some(domain => afterProtocol.indexOf(domain) === 0)) {
      return afterProtocol.split('?')[0].split('/')[4]
    }
  }

  if (!spreadsheetKeyRegex.test(string)) {
    if (!silent) throw new Error(`Cannot parse spreadsheet key from value: ${string}`)
    else return null
  }

  // assume it's a plain key
  return string
}

export default parseKey
