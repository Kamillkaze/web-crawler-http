const { JSDOM } = require('jsdom')

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
        return hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
}