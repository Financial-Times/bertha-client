// @flow
/* eslint-disable no-console */

import * as bertha from '..'

test('createURL', () => {
  expect(bertha.createURL('ABC123', ['foo'])).toBe(
    'https://bertha.ig.ft.com/view/publish/gss/ABC123/foo',
  )

  expect(bertha.createURL('ABC123', ['foo|object'])).toBe(
    'https://bertha.ig.ft.com/view/publish/gss/ABC123/foo',
  )

  expect(
    bertha.createURL('ABC123', ['foo'], {
      query: {
        exp: 0,
      },
    }),
  ).toBe('https://bertha.ig.ft.com/view/publish/gss/ABC123/foo?exp=0')

  expect(bertha.createURL('ABC123', ['foo', 'bar'])).toBe(
    'https://bertha.ig.ft.com/view/publish/gss/ABC123/bar,foo',
  )

  expect(bertha.createURL('ABC123', ['foo|object', 'bar'])).toBe(
    'https://bertha.ig.ft.com/view/publish/gss/ABC123/bar,foo',
  )

  expect(
    bertha.createURL('ABC123', ['foo', 'bar'], {
      query: {
        exp: 0,
      },
    }),
  ).toBe('https://bertha.ig.ft.com/view/publish/gss/ABC123/bar,foo?exp=0')
})
