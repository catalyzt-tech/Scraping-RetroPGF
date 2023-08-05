import puppeteer from 'puppeteer'
import fs from 'fs'

const getinfo = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  })

  try {
    const page = await browser.newPage()
    await page.goto('https://app.optimism.io/retropgf-discovery', {
      waitUntil: 'domcontentloaded',
    })

    await page.waitForTimeout(15000)
    const data = await page.evaluate(() => {
      const card = document.querySelectorAll('._container_1dvyk_1')
      return Array.from(card).map((item) => {
        const name = item.querySelector('h3').innerText
        const description = item.querySelector('p').innerText
        const category = item.querySelector('button>span').innerText
        const icon64 = item.querySelector('img').src
        const icon = Buffer.from(icon64.slice(22), 'base64')
        const banner64 = item.querySelector('._banner_1dvyk_15 > img').src
        const banner = Buffer.from(banner64.slice(22), 'base64')
        const pathsaveicon = `${name}_icon.png`
        const pathsavebanner = `${name}_banner.png`
        fs.writeFileSync(pathsaveicon, icon, 'binary')
        fs.writeFileSync(pathsavebanner, banner, 'binary')

        return { name, description, category, icon, banner }
      })
    })
    let buttonclicked = true
    while (buttonclicked) {
      try {
        await page.$eval('._primaryButton_7jap0_6', (button) => button.click())
        await page.waitForTimeout(6000)
      } catch (error) {
        buttonclicked = false
      }
    }
    // await page.click('._primaryButton_7jap0_6');
    fs.writeFileSync('Test2xx.json', JSON.stringify(data))
    console.log(data)
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    console.log('Done Scraping')
    await browser.close()
  }
}

getinfo()
