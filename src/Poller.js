// @flow

import EventEmitter from 'events';
import Bluebird from 'bluebird';
import get from './get';
import createURL from './createURL';
import type { BerthaResponse } from './types';

const defaults = {
  refreshAfter: 60000,
  attempts: 3,
  retryAfter: 2000,
};

type Options = {
  republish?: boolean,
  query?: { [string]: string | number },
  refreshAfter: number,
  attempts: number,
  retryAfter: number,
};

type PrivateMembers = {
  refresh: () => Promise<void>,
  data?: BerthaResponse,
  intervalRef?: number,
  startPromise?: Promise<void>,
};

// eslint-disable-next-line no-use-before-define
const privateMembers: WeakMap<Poller, PrivateMembers> = new WeakMap();

// eslint-disable-next-line no-use-before-define
const getPrivates = (instance: Poller): PrivateMembers => {
  const priv = privateMembers.get(instance);
  if (!priv) throw new Error('Instance does not exist');
  return priv;
};

export default class Poller extends EventEmitter {
  constructor(spreadsheetKey: string, sheetDescriptors: string[], _options?: Object) {
    super();

    const options: Options = { ...defaults, ..._options };

    if (typeof options.refreshAfter !== 'number' || options.refreshAfter < 1000) {
      throw new TypeError('The refreshAfter option must be a number over 1000');
    }

    const priv: PrivateMembers = {
      refresh: async () => {},
    };

    const optionsForGet = {
      republish: options.republish,
      query: options.query,
    };

    const attemptRefresh = async () => {
      this.emit('info', `Fetching ${createURL(spreadsheetKey, sheetDescriptors, optionsForGet)}`);

      const data = await get(spreadsheetKey, sheetDescriptors, optionsForGet);

      this.emit(
        'info',
        `Got response from ${createURL(spreadsheetKey, sheetDescriptors, optionsForGet)}`,
      );

      return data;
    };

    priv.refresh = async () => {
      this.emit('info', 'Starting refresh');

      let promise = attemptRefresh();

      // add some rejection-catchers to carry out retries
      for (let i = 0; i < options.attempts - 1; i += 1) {
        // eslint-disable-next-line no-loop-func
        promise = promise.catch(async (error) => {
          this.emit('warning', `Fetch failed; retrying after ${options.retryAfter} ms`, error);

          await Bluebird.delay(options.retryAfter);
          return attemptRefresh();
        });
      }

      // if we already have data from the previous attempt, just swallow and log the error
      if (typeof priv.data === 'object') {
        promise.catch((error: Error) => {
          this.emit(
            'warning',
            `Stale data: failed to refresh after ${options.attempts} attempts`,
            error,
          );
        });
      }

      priv.data = (await promise) || priv.data;

      // refresh again in a minute
      priv.intervalRef = setTimeout(priv.refresh, options.refreshAfter);
    };

    privateMembers.set(this, priv);
  }

  async start(): Promise<void> {
    const priv = getPrivates(this);

    if (!priv.startPromise) {
      priv.startPromise = priv.refresh();
    }

    return priv.startPromise;
  }

  getData(): BerthaResponse {
    const priv = getPrivates(this);

    if (!priv.data) {
      throw new Error('Poller has not fetched any data (did you forget to await poller.start()?)');
    }

    return priv.data;
  }

  stop(): void {
    const priv = getPrivates(this);
    clearInterval(priv.intervalRef);
  }
}
