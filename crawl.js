const { JSDOM } = require('jsdom')

async function crawlPage(baseUrl, currentUrl, pages) {
    const baseUrlObj = new URL(baseUrl)
    const currentUrlObj = new URL(currentUrl)
    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        return pages
    }
    const currentUrlNormalized = normalizeURL(currentUrl)
    if (pages[currentUrlNormalized] > 0) {
        pages[currentUrlNormalized]++
        return pages
    } 
    pages[currentUrlNormalized] = 1

    console.log(`actively crawling ${currentUrl}`)
    try {
        const resp = await fetch(currentUrl)
        if (resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status}, on page ${currentUrl}`)
            return pages
        }

        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')) {
            console.log(`error in fetch, content type: ${contentType}, on page: ${currentUrl}`)
            return pages
        }

        const htmlBody = await resp.text()

        const internalUrls = getURLsFromHTML(htmlBody, baseUrl) // Bug with using current instead of baseUrl

        for (const url of internalUrls) {
            pages = await crawlPage(baseUrl, url, pages)
        }
    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentUrl}`)
    }
    return pages
}

function getURLsFromHTML(htmlBody, path) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const element of linkElements) {
        const href = element.href
        let toBePushed = ''
        if (href[0] === '/') {
            toBePushed = path + href
        } else {
            toBePushed = href
        }

        if (isUrlValid(toBePushed)) {
            urls.push(toBePushed)
        }
    }
    return urls
}

function isUrlValid(url) {
    try {
        const urlObj = new URL(url)
        return true
    } catch (err) {
        console.log(`error with url: ${err.message}`)
        return false
    }
}

function normalizeURL(url) {
    const urlObj = new URL(url)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}