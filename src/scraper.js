const puppeteer = require('puppeteer')

const scrapeForOfficePrice = async () => {
  const url = 'https://itunes.apple.com/us/tv-season/the-office-the-complete-series/id1438674900';
  console.log('starting headless browser...')
  const puppeteerLaunchOptions = process.platform === 'linux'
    ? { headless: true, args: ['--no-sandbox'], executablePath: 'chromium-browser' }
    : { headless: true }
  const browser = await puppeteer.launch(puppeteerLaunchOptions)
  const page = await browser.newPage()

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')

  console.log('checking url...')
  await page.goto(url, {waitUntil: 'networkidle2'}).catch(console.warn)

  console.log('checking price...')
  const isOnSale = await page.evaluate(() => {
    const price = document.querySelector('span[data-test-price="buy"]').innerText
    const dollarValue = price.slice(1, price.length-3)
    return dollarValue
  })

  await browser.close()

  return isOnSale
}

  module.exports = scrapeForOfficePrice