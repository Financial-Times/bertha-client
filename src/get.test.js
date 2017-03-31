// @flow
/* eslint-disable no-console */

import test from 'ava';
import nock from 'nock';
import * as bertha from '.';

test('get single sheet', async (t) => {
  const data = [
    { cat: 1, dog: 2 },
    { cat: 3, dog: 4 },
  ];

  const mock = nock('https://bertha.ig.ft.com')
    .get('/view/publish/gss/ABC123/foo')
    .reply(200, data)
  ;

  const response = await bertha.get('ABC123', ['foo']);

  t.deepEqual(response, {
    foo: data,
  });

  mock.done();
});

test('get multiple sheets', async (t) => {
  const data = {
    foo: [
      { cat: 1, dog: 2 },
      { cat: 3, dog: 4 },
    ],
    bar: [
      { parrot: 1, fish: 2 },
      { parrot: 3, fish: 4 },
    ],
  };

  const mock = nock('https://bertha.ig.ft.com')
    .get('/view/publish/gss/ABC123/bar,foo') // sheet names get sorted alphabetically
    .reply(200, data)
  ;

  const response = await bertha.get('ABC123', ['foo', 'bar']);

  t.deepEqual(response, data);

  mock.done();
});

test('get single sheet with `|object` transform', async (t) => {
  const data = [
    { name: 'cat', value: 'yar' },
    { name: 'dog', value: 456 },
  ];

  const mock = nock('https://bertha.ig.ft.com')
    .get('/view/publish/gss/ABC123/foo')
    .reply(200, data)
  ;

  const response = await bertha.get('ABC123', ['foo|object']);

  t.deepEqual(response, {
    foo: {
      cat: 'yar',
      dog: '456',
    },
  });

  mock.done();
});

test('get multiple sheets with `|object` transform', async (t) => {
  const data = {
    foo: [
      { name: 'cat', value: 'yar' },
      { name: 'dog', value: 456 },
    ],
    bar: [
      { parrot: 1, fish: 2 },
      { parrot: 3, fish: 4 },
    ],
  };

  const mock = nock('https://bertha.ig.ft.com')
    .get('/view/publish/gss/ABC123/bar,foo')
    .reply(200, data)
  ;

  const response = await bertha.get('ABC123', ['foo|object', 'bar']);

  t.deepEqual(response, {
    foo: {
      cat: 'yar',
      dog: '456',
    },
    bar: data.bar,
  });

  mock.done();
});

test('get single sheet with `|object` transform with dot-separated keys', async (t) => {
  const data = [
    { name: 'cat.name.first', value: 'Bob' },
    { name: 'cat.name.last', value: 'Hoskins' },
    { name: 'cat.age', value: 24 },
    { name: 'dog', value: 'other' },
  ];

  const mock = nock('https://bertha.ig.ft.com')
    .get('/view/publish/gss/ABC123/foo')
    .reply(200, data)
  ;

  const response = await bertha.get('ABC123', ['foo|object']);

  t.deepEqual(response, {
    foo: {
      cat: {
        name: { first: 'Bob', last: 'Hoskins' },
        age: '24',
      },
      dog: 'other',
    },
  });

  mock.done();
});
