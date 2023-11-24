import transactions from './transactions.json' assert { type: 'json' }
import puppeteer from 'puppeteer'
import fs from 'fs'

let name = []
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
})
for (let i of transactions) {
  const page = await browser.newPage()
  await page.goto(`https://optimism.easscan.org/attestation/view/${i}`)
  await page.waitForSelector(
    'body > div > main > div.page__OuterScreenBlockPadding-sc-1b891jo-0.fPMxtl > div > div > div.global__PropertiesList-sc-1edpchi-6.ANFrD > div:nth-child(1) > div.global__PropertyValue-sc-1edpchi-9.deSTWP'
  )
  let list = await page.$eval(
    'div > div:nth-child(1) > div.DecodedAttestationValue__Col-sc-r2j0qb-1.DecodedAttestationValue__Val-sc-r2j0qb-4.bjDINt.kDjzGR',
    (div) => div.textContent
  )
  console.log(list)
  name.push(list)
  await page.close()
}
console.log(name.length)

await browser.close()
fs.writeFileSync('./name.json', JSON.stringify(name))
