const config = require('../config.js')
const scrapeDelayInterval = config.scrapeDelayInterval
const scrapeForOfficePrice = require('./scraper')
const sendText = require('./smsService.js')

const determineIfGoodSale = (price) => {
  const intPrice = parseInt(price)

  if (isNaN(intPrice)) return 'something went wrong'

  return intPrice < 40
}

const handleScrape = async (err) => {
  const handleError = () => {
    console.log(`Something went wrong with The Office sale checker. Check it out: ${err}`)
    // sendText('Something went wrong with The Office sale checker. Check it out yo.')
  }

  try {
    const price = await scrapeForOfficePrice()

    const sendMessage = determineIfGoodSale(price)

    if (sendMessage === 'something went wrong') {
      console.log('???')
      handleError('error when comparing prices')
    } else if (sendMessage) {
      console.log(`The Office is on sale for $${price}`)
      sendText(`The Office is on sale for $${price}`)
    } else {
      console.log(`no sale, costs $${price}`)
      // sendText(`no sale, costs $${price}`)
    }
  } catch (e) {
    console.log('??')
    handleError(e)
  }

  console.log(`all done! will check again in ${scrapeDelayInterval} minutes :)`)
}

const runCheckRefurbApp = () => {
  handleScrape()

  setInterval(() => {
    handleScrape()
  }, scrapeDelayInterval * 60000)
  // }, scrapeDelayInterval * 500)
}

runCheckRefurbApp()
