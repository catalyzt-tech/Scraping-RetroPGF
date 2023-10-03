import puppeteer from 'puppeteer'
import { Alchemy, Network } from 'alchemy-sdk'
import fs from 'fs'
;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })

  const config = {
    apiKey: 'M_3gMwwnhUbhZpmi76kXHfGf9eQ2PNTC',
    network: Network.ETH_MAINNET,
  }
  const alchemy = new Alchemy(config)
  const addresses = []
  try {
    const page = await browser.newPage()

    for (let i = 1; i <= 6; i++) {
      await page.goto(
        `https://optimism.easscan.org/attestations/forSchema/0x76e98cce95f3ba992c2ee25cef25f756495147608a3da3aa2e5ca43109fe77cc?page=${i}&limit=50`
      )
      await page.waitForSelector('table tbody tr')
      const list = await page.$$('table tbody tr')
      for (const element of list) {
        const addressWithLink = await element.$eval(
          'td:nth-child(3) > a',
          (a) => a.href.slice(8)
        )
        const address = addressWithLink.replace(
          'optimism.easscan.org/address/',
          ''
        )
        addresses.push(address)
      }
      console.log(addresses.length)
    }
    // await page.waitForSelector(
    //   '.PageBar__Container-sc-8zhn9j-0 yYkJo AttestationTable__Bar-sc-13xm70b-2 bYAhpb>div:nth-child(4)'
    // )
    // const button = await page.$(
    //   '.PageBar__Container-sc-8zhn9j-0 yYkJo AttestationTable__Bar-sc-13xm70b-2 bYAhpb>div:nth-child(4)'
    // )
    // await button.click()

    for (const each of addresses) {
      const input = each
      if (input.endsWith('.eth')) {
        const resolvedAddress = await alchemy.core.resolveName(input)
        each = resolvedAddress
      }
    }
  } catch (error) {
    console.error('An error occurred:' + error)
  } finally {
    console.log('Done Scraping')
    fs.writeFileSync('./addresses.json', JSON.stringify(addresses))
    console.log(addresses)
    await browser.close()
  }
})()
