// @flow

// use global fetch in browser, or node-fetch in node
const fetch = global.fetch || require('node-fetch'); // eslint-disable-line global-require

const defaults = {
  republish: false,
};

type Options = {
  republish?: boolean,
};

export default async (
  spreadsheetKey: string,
  sheetDescriptors: string[],
  _options: Options,
) => {
  // apply defaults
  const options = { ...defaults, ..._options };

  // process the sheet descriptors
  const sheets = sheetDescriptors.map((descriptor) => {
    const [name, ...flags] = descriptor.split('|');

    return { name, flags };
  });

  if (sheets.some(({ name }) => name.charAt(0) === '+')) {
    throw new Error('Plus-operator (for optional sheets) is not supported by bertha-client');
  }

  const url = `https://bertha.ig.ft.com/${options.republish ? 'republish' : 'view'}/publish/gss/${spreadsheetKey}/${sheets.map(s => encodeURIComponent(s.name)).join(',')}`;

  // download the data
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Non-200 response for URL ${url}`);
  const data = await response.json();

  // normalize the response data
  const result = sheets.length === 1 ? { [sheets[0].name]: data } : data;

  // process any flags
  sheets.forEach(({ name: sheetName, flags }) => {
    flags.forEach((flag) => {
      switch (flag) {
        case 'object':
          if (result.length) {
            const keys = Object.keys(result[0]);

            if (keys.indexOf('name' === -1) || keys.indexOf('value' === -1)) {
              throw new Error(`Bertha sheet "${sheetName}" cannot be processed with the "object" flag as it does not have "name" and "value" columns`);
            }
          }

          // process this one as an object
          result[sheetName] = result[sheetName].reduce((acc, { name, value }) => ({
            ...acc,
            [String(name)]: String(value),
          }), {});

          break;

        default: throw new Error(`Invalid flag "${flag}"`);
      }
    });
  });

  return result;
};
