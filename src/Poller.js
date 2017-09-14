// @flow

import _ from 'lodash';
import EventEmitter from 'events';
import get from './get';

const defaults = {
  refreshInterval: 60000,
};

type Options = {
  republish?: boolean,
  query?: { [string]: string | number },
};

const INTERVAL = Symbol('INTERVAL');
const QUEUED_CALLS = Symbol('QUEUED_CALLS');
const DATA = Symbol('DATA');

export default class Poller extends EventEmitter {
  constructor(spreadsheetKey: string, sheetDescriptors: string[], _options?: Options) {
    super();

    const options = { ...defaults, ..._options };

    if (typeof options.refreshInterval !== 'number' || options.refreshInterval < 1000) {
      throw new TypeError('The refreshInterval option must be a number over 1000');
    }

    const getOptions = _.omit(options, 'refreshInterval');

    this[QUEUED_CALLS] = [];

    const getNow = () => {
      get(spreadsheetKey, sheetDescriptors, getOptions).then((data) => {
        this[DATA] = data;

        if (this[QUEUED_CALLS]) {
          this[QUEUED_CALLS].forEach((fn) => {
            fn();
          });

          delete this[QUEUED_CALLS];
        }
      });
    };

    this[INTERVAL] = setInterval(getNow, options.refreshInterval);

    setImmediate(getNow);
  }

  async get() {
    if (!this[QUEUED_CALLS]) return this[DATA];

    return new Promise((resolve) => {
      this[QUEUED_CALLS].push(() => {
        resolve(this[DATA]);
      });
    });
  }

  stop() {
    clearInterval(this[INTERVAL]);
  }
}
