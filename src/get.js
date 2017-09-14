// @flow

import createURL from './createURL'

// use global fetch in browser, or node-fetch in node
const fetch = global.fetch || require('node-fetch').default // eslint-disable-line global-require

const defaults = {
  republish: false,
}

type Options = {
  republish?: boolean,
  query?: { [string]: string | number },
}

const get = async (spreadsheetKey: string, sheetDescriptors: string[], _options?: Options) => {
  // apply defaults
  const options = { ...defaults, ..._options }

  // process the sheet descriptors
  const sheets = sheetDescriptors.map((descriptor) => {
    const [name, ...flags] = descriptor.split('|')

    if (name.indexOf(',') !== -1) {
      throw new Error(
        'bertha-client: Sheet name cannot contain commas (did you mean to pass an array of separate strings?)',
      )
    }

    return { name, flags }
  })

  if (sheets.some(({ name }) => name.charAt(0) === '+')) {
    throw new Error(
      'bertha-client: Plus-operator (for optional sheets) is not supported by bertha-client',
    )
  }

  const url = createURL(spreadsheetKey, sheetDescriptors, options)

  // download the data
  const response = await fetch(url)
  if (!response.ok) throw new Error(`bertha-client: Non-200 response for URL ${url}`)
  const data = await response.json()

  // normalize the structure so it's always an object, even if only one sheet
  const result = sheets.length === 1 ? { [sheets[0].name]: data } : data

  // process any flags
  sheets.forEach(({ name: sheetName, flags }) => {
    flags.forEach((flag) => {
      switch (flag) {
        case 'object': {
          if (result.length) {
            const keys = Object.keys(result[0])

            if (keys.indexOf('name' === -1) || keys.indexOf('value' === -1)) {
              throw new Error(
                `bertha-client: Bertha sheet "${sheetName}" cannot be processed with the "object" flag as it does not have "name" and "value" columns`,
              )
            }
          }

          // process this one as an object
          const object = {}
          result[sheetName].forEach(({ name, value }) => {
            const nameParts = name.split('.')

            let ref = object
            nameParts.forEach((namePart, i) => {
              if (i === nameParts.length - 1) {
                ref[namePart] = value
              } else {
                ref[namePart] = ref[namePart] || {}
                ref = ref[namePart]
              }
            })
          })

          result[sheetName] = object

          break
        }

        default:
          throw new Error(`bertha-client: Invalid flag "${flag}"`)
      }
    })
  })

  return result
}

export default get
