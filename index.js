const https = require('https')
const config = require('./config')
const cheerio = require('cheerio')

const fetchIP = async function (location) {
    const parseHtml = function (htmlString) {
        const $ = cheerio.load(htmlString)
        const searched = $('ul[class=comma-separated]').html()
        const $2 = cheerio.load(searched)
        const results = $2('li')
        const ips = []
        for (let i = 0; i < results.length; i++) {
            const x = results[i].children[0].data
            ips.push(x)
        }
        return ips
    }

    const html = await new Promise(function (resolve, reject) {
        const req = https.request(location, (res) => {
            if (config.debug) {
                console.debug('状态码:', res.statusCode)
                console.debug('请求头:', res.headers)
            }

            let s = ''
            res.on('data', (d) => {
                s += d
            })

            res.on('end', function () {
                if (config.debug) {
                    console.debug(s)
                }
                resolve(s)
            })

        })

        req.on('error', (e) => {
            reject(e)
        })
        req.end()
    })

    return parseHtml(html)
}


const fetchLocation = async function (host) {
    const url = 'https://www.ipaddress.com/search/' + host

    return await new Promise(function (resolve, reject) {
        const req = https.request(url, (res) => {
            if (config.debug) {
                console.debug('状态码:', res.statusCode)
                console.debug('请求头:', res.headers)
            }

            resolve(res.headers['location'])
        })

        req.on('error', (e) => {
            reject(e)
        })
        req.end()
    })
}

const main = async function () {
    try {
        for (let i = 0; i < config.hosts.length; i++) {
            const host = config.hosts[i]
            const location = await fetchLocation(host)
            const ips = await fetchIP(location)

            if (config.multipleResults) {
                for (let j = 0; j < ips.length; j++) {
                    console.log(ips[j], host)
                }
            } else {
                console.log(ips[0], host)
            }
        }

    } catch (e) {
        console.error(e)
    }
}

main()
