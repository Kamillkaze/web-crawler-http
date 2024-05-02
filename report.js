function printReport(pages) {
    console.log('===============')
    console.log('START REPORT')
    console.log('===============')
    const sortedPages = sortPages(pages)
    for (const page of sortedPages) {
        const url = page[0]
        const hits = page[1]
        console.log(`Found ${hits} links to the page: ${url}`)
    }
    console.log('===============')
    console.log('END REPORT')
    console.log('===============')
}

function sortPages(pages) {
    let sorted = []
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a, b) => {
        return b[1] -  a[1]
    })
    return pagesArr
}

module.exports = {
    sortPages,
    printReport
}