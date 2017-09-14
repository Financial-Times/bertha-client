// @flow
/* eslint-disable no-console */

import nock from 'nock';
import Bluebird from 'bluebird';
import * as bertha from '..';

test('Poller', async () => {
  const firstMock = nock('https://bertha.ig.ft.com')
    .get('/view/publish/gss/ABC123/foo')
    .reply(200, [
      { name: 'cat.name.first', value: 'Bob' },
      { name: 'cat.name.last', value: 'Hoskins' },
      { name: 'cat.alive', value: true },
      { name: 'cat.age', value: 24 },
      { name: 'dog', value: 'other' },
    ]);

  const poller = new bertha.Poller('ABC123', ['foo|object'], { refreshAfter: 1000 });

  // poller.on('warning', (...args) => {
  //   console.log('WARNING', ...args);
  // });
  //
  // poller.on('info', (...args) => {
  //   console.log('INFO', ...args);
  // });

  expect(() => {
    poller.getData();
  }).toThrow();

  await poller.start();

  firstMock.done();

  const firstResponse = poller.getData();
  expect(firstResponse).toEqual({
    foo: {
      cat: {
        name: { first: 'Bob', last: 'Hoskins' },
        age: 24,
        alive: true,
      },
      dog: 'other',
    },
  });

  // ensure another request after a short delay gets exactly the same response back
  await Bluebird.delay(100);
  const firstResponseCopy = poller.getData();
  expect(firstResponseCopy).toBe(firstResponse);

  // mock it again with new data, and wait a full second so the poller has time to get it
  const secondMock = nock('https://bertha.ig.ft.com')
    .get('/view/publish/gss/ABC123/foo')
    .reply(200, [{ name: 'now', value: 'changed!' }]);

  await Bluebird.delay(1000);

  const secondResponse = poller.getData();

  expect(secondResponse).toEqual({
    foo: {
      now: 'changed!',
    },
  });

  secondMock.done();

  poller.stop();
});
