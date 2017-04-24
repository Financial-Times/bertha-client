// @flow
/* eslint-disable no-console */

import test from 'ava';
import { parseKey, domains } from '.';

test('parse key', async (t) => {
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

  t.is(parseKey(key), key, 'handles a plain key');

  t.true(gsURLs.every(url => parseKey(url) === key), 'handles a Google Spreadsheets URL');

  invalidStrings.forEach((url) => {
    t.throws(() => {
      parseKey(url);
    }, /Cannot parse spreadsheet key from value/, 'throws on invalid input');
  });

  invalidStrings.forEach((url) => {
    t.notThrows(() => {
      t.is(parseKey(url, true), null);
    }, 'returns null for invalid strings in silent mode');
  });
});
