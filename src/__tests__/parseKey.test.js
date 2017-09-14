// @flow
/* eslint-disable no-console */

import { parseKey, domains } from '..';

test('parse key', async () => {
  const key = '0Ajt08GcPGJRbdFJUZWZfZ3M1V0xDaTFBckJnNENCSGc';
  const gsURLs = [
    `https://docs.google.com/a/ft.com/spreadsheet/ccc?key=${key}`,
    `https://docs.google.com/a/ft.com/spreadsheet/ccc?key=${key}#hash`,
    `https://docs.google.com/a/ft.com/spreadsheet/ccc?key=${key}&foo=bar`,
    `https://docs.google.com/a/ft.com/spreadsheet/ccc?key=${key}&foo=bar#hash`,

    // new-style urls...
    `https://docs.google.com/spreadsheets/d/${key}`,
    `https://docs.google.com/a/ft.com/spreadsheets/d/${key}#gid=0`,
    `https://docs.google.com/a/ft.com/spreadsheets/d/${key}/edit`,
    `https://docs.google.com/a/ft.com/spreadsheets/d/${key}/edit#gid=0`,

    `https://docs.google.com/a/ft.com/spreadsheets/foo/${key}`,
    `https://docs.google.com/a/ft.com/spreadsheets/foo/${key}#gid=0`,
    `https://docs.google.com/a/ft.com/spreadsheets/foo/${key}/edit`,
    `https://docs.google.com/a/ft.com/spreadsheets/foo/${key}/edit#gid=0`,

    // newer-still-style urls...
    `https://docs.google.com/spreadsheets/d/${key}`,
    `https://docs.google.com/spreadsheets/d/${key}#gid=0`,
    `https://docs.google.com/spreadsheets/d/${key}/edit`,
    `https://docs.google.com/spreadsheets/d/${key}/edit#gid=0`,

    `https://docs.google.com/spreadsheets/foo/${key}`,
    `https://docs.google.com/spreadsheets/foo/${key}#gid=0`,
    `https://docs.google.com/spreadsheets/foo/${key}/edit`,
    `https://docs.google.com/spreadsheets/foo/${key}/edit#gid=0`,
  ];

  const berthaURLs = [];

  domains.forEach((host) => {
    berthaURLs.push([
      `http://${host}/view/publish/ig/${key}`,
      `http://${host}/republish/publish/ig/${key}/basic,foo`,
      `http://${host}/view/publish/ig/${key}?callback=hi`,
    ]);
  });

  const invalidStrings = [
    'ab==gsgsc....asdfasdf 891 sd', // invalid chars
    `https://mops.google.com/a/ft.com/spreadsheet/ccc?key=${key}`, // wrong hostname
    '0Ajt08GcPGJRbdFJUZWZfZ3M1V0xDaTFBckJnNENCSGc/', // slash at end
    '0Ajt08GcPGJRbdFJUZWZfZ', // too short
    '0Ajt08GcPGJRbdFJUZWZfZ3M1V0xDaTFBckJnNENCSGc0Ajt08GcPGJRbdFJUZWZfZ3M1V0xDaTFBckJnNENCSGc', // too long
  ];

  expect(parseKey(key)).toBe(key);

  expect(gsURLs.every(url => parseKey(url) === key)).toBe(true);

  invalidStrings.forEach((url) => {
    expect(() => {
      parseKey(url);
    }).toThrowError(/Cannot parse spreadsheet key from value/);
  });

  invalidStrings.forEach((url) => {
    expect(() => {
      expect(parseKey(url, true)).toBe(null);
    }).not.toThrowError('returns null for invalid strings in silent mode');
  });
});
