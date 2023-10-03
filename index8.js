import puppeteer from 'puppeteer'
import fs from 'fs'
import addresses from './addresses.json' assert { type: 'json' }
let profiles = []
;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })

  const page = await browser.newPage()

  for (let i of addresses) {
    // const url = `https://content.optimism.io/profile/v0/metadata/10/${i}.json`
    const url = `https://content.optimism.io/rpgf3Application/v0/metadata/10/${i}.json`
    await page.goto(url)
    const jsonContent = await page.evaluate(() =>
      JSON.parse(document.querySelector('body').innerText)
    )
    profiles.push(jsonContent)
    console.log(jsonContent)
    console.log(profiles.length)
  }
  await browser.close()
  await fs.writeFileSync('./application.json', JSON.stringify(profiles))
})()
