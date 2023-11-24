import profiles from './profiles.json' assert { type: 'json' }
import address from './addresses.json' assert { type: 'json' }
import puppeteer from 'puppeteer'
import fs from 'fs'

let transactions = []
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
})
for (let i of address) {
  const page = await browser.newPage()
  await page.goto(`https://optimism.easscan.org/address/${i}`)
  await page.waitForSelector('table tbody tr')
  let list = await page.$$('table tbody tr')
  list = list.slice(0, 1)
  for (const element of list) {
    const transactionWithLink = await element.$eval(
      'td:nth-child(1) > a',
      (a) => a.href
    )
    const transaction = transactionWithLink.replace(
      'https://optimism.easscan.org/attestation/view/',
      ''
    )
    console.log(transaction)
    transactions.push(transaction)
    await page.close()
  }
  console.log(transactions.length)
}
await browser.close()
fs.writeFileSync('./transactions.json', JSON.stringify(transactions))
