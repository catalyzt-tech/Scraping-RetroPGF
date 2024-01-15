import fs from 'fs'
import puppeteer from 'puppeteer'
import projectIdArr from './projectIdArr.json' assert { type: 'json' }

let collectLink = []
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
})

for (let i of projectIdArr) {
  try {
    const page = await browser.newPage()
    await page.goto(`https://optimism.easscan.org/attestation/view/${i}`)
    await page.waitForTimeout(2000)
    await page.waitForSelector(
      '.DecodedAttestationValue__Output-sc-r2j0qb-3.jbpDTY'
    )
    const link = await page.$eval(
      'body > div > main > div:nth-child(3) > div > div > div.global__PropertiesList-sc-1edpchi-6.ANFrD > div:nth-child(1) > div.global__PropertyValue-sc-1edpchi-9.gjctwn > div > div:nth-child(3) > div.DecodedAttestationValue__Col-sc-r2j0qb-1.DecodedAttestationValue__Val-sc-r2j0qb-4.bjDINt.kDjzGR > div',
      (div) => div.innerHTML
    )

    console.log(link)
    collectLink.push(link)
    console.log(collectLink.length)
    await page.close()
  } catch (err) {
    console.error(err)
  }
}

fs.writeFileSync('metadataAddress.json', JSON.stringify(collectLink))
