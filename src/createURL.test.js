// @flow
/* eslint-disable no-console */

import test from 'ava';
import * as bertha from '.';

test('createURL', (t) => {
  t.is(bertha.createURL('ABC123', ['foo']), 'https://bertha.ig.ft.com/view/publish/gss/ABC123/foo');

  t.is(bertha.createURL('ABC123', ['foo|object']), 'https://bertha.ig.ft.com/view/publish/gss/ABC123/foo');

  t.is(bertha.createURL('ABC123', ['foo'], {
    query: {
      exp: 0,
    },
  }), 'https://bertha.ig.ft.com/view/publish/gss/ABC123/foo?exp=0');

  t.is(bertha.createURL('ABC123', ['foo', 'bar']), 'https://bertha.ig.ft.com/view/publish/gss/ABC123/bar,foo');

  t.is(bertha.createURL('ABC123', ['foo|object', 'bar']), 'https://bertha.ig.ft.com/view/publish/gss/ABC123/bar,foo');

  t.is(bertha.createURL('ABC123', ['foo', 'bar'], {
    query: {
      exp: 0,
    },
  }), 'https://bertha.ig.ft.com/view/publish/gss/ABC123/bar,foo?exp=0');
});
