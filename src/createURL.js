// @flow

const defaults = {
  republish: false,
};

type Options = {
  republish?: boolean,
  query: { [string]: string | number },
};

const createURL = (
  spreadsheetKey: string,
  sheetDescriptors: string[],
  _options?: Options,
) => {
  // apply defaults
  const options = { ...defaults, ..._options };

  let search = '';
  if (options.query) {
    search = `?${
      Object.keys(options.query).map(name => (
        `${encodeURIComponent(name)}=${encodeURIComponent(String(options.query[name]))}`
      )).join('&')
    }`;
  }

  const sheetNames = sheetDescriptors.map(s => s.split('|')[0]);

  const url = (
    `https://bertha.ig.ft.com/${
      options.republish ? 'republish' : 'view'
    }/publish/gss/${spreadsheetKey}/${
      sheetNames.map(name => encodeURIComponent(name)).sort().join(',')
    }${search}`
  );

  return url;
};

export default createURL;
