import puppeteer from 'puppeteer'
import fs from 'fs'

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
})

try {
  const page = await browser.newPage()
  await page.goto('https://app.optimism.io/retropgf-discovery')
  await page.waitForSelector('._primaryButton_7jap0_6')
  while (true) {
    try {
      await page.$eval('._primaryButton_7jap0_6', (button) => button.click())
      await page.waitForSelector('._primaryButton_7jap0_6', { timeout: 10000 })
    } catch (error) {
      break
    }
  }
  const cards = await page.$$('._container_1dvyk_1')
  for (const List of cards) {
    const name = await List.$eval('h3', (h3) => h3.innerText)
    const description = await List.$eval('p', (p) => p.innerText)
    const category = await List.$eval('button>span', (span) => span.innerText)
    // const cleanName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const cleanName = name
    fs.mkdirSync(`out/${cleanName}`, { recursive: true })
    fs.writeFileSync(
      `out/${cleanName}/info.json`,
      JSON.stringify({ name, description, category })
    )
    const icon64 = await List.$eval('._logo_1dvyk_63', (img) => img.src)
    const banner64 = await List.$eval(
      '._banner_1dvyk_15 > img',
      (img) => img.src
    )
    const icon = Buffer.from(icon64.slice(22), 'base64')
    const banner = Buffer.from(banner64.slice(22), 'base64')
    fs.writeFileSync(`out/${cleanName}/icon.jpg`, icon, 'binary')
    fs.writeFileSync(`out/${cleanName}/banner.jpg`, banner, 'binary')
  }
} catch (error) {
  console.error('An error occurred:' + error)
} finally {
  console.log('Done Scraping')
  await browser.close()
}
