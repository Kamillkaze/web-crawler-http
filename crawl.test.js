const { normalizeURL, getURLsFromHTML } = require('./crawl.js')
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

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path">
                #Click me
            </a>
        </body>
    </html>`
    const inputUrl = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputUrl)
    const expected = ["https://blog.boot.dev/path"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path">
                #Click me
            </a>
        </body>
    </html>`
    const inputUrl = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputUrl)
    const expected = ["https://blog.boot.dev/path"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path1">
                #Click me
            </a>
            <a href="/path2">
                #Click me
            </a>
        </body>
    </html>`
    const inputUrl = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputUrl)
    const expected = ["https://blog.boot.dev/path1", "https://blog.boot.dev/path2"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML bad url', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">
                #Click me
            </a>

        </body>
    </html>`
    const inputUrl = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputUrl)
    const expected = []
    expect(actual).toEqual(expected)
})