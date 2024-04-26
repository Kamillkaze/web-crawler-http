const { normalizeURL } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL should strip https protocol', () => {
    const input = 'https://google.com/path'
    const actual = normalizeURL(input)
    const expected = 'google.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL should strip http protocol', () => {
    const input = 'http://google.com/path'
    const actual = normalizeURL(input)
    const expected = 'google.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL should strip trailing spaces', () => {
    const input = 'https://google.com/path/'
    const actual = normalizeURL(input)
    const expected = 'google.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL should ignore capitals', () => {
    const input = 'https://gOOgle.COM/path'
    const actual = normalizeURL(input)
    const expected = 'google.com/path'
    expect(actual).toEqual(expected)
})