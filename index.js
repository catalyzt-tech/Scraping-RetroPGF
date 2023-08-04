const puppeteer = require('puppeteer')
const fs = require('fs')
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

    await page.waitForTimeout(100000)
    const data = await page.evaluate(() => {
      const card = document.querySelectorAll('._container_1dvyk_1')

      return Array.from(card).map((item) => {
        const name = item.querySelector('h3').innerText
        const description = item.querySelector('p').innerText
        const category = item.querySelector('button>span').innerText
        // const x = item
        //   .querySelector('img')
        //   .src.replace(/^data:image\/png;base64,/, '')
        // const y = item
        //   .querySelector('_banner_1dvyk_15 > img')
        //   .src.replace(/^data:image\/png;base64,/, '')

        const iconElement = item.querySelector('img')
        const bannerElement = item.querySelector('_banner_1dvyk_15 > img')

        const x = iconElement
          ? iconElement.src.replace(/^data:image\/png;base64,/, '')
          : ''
        const y = bannerElement
          ? bannerElement.src.replace(/^data:image\/png;base64,/, '')
          : ''

        const icon = Buffer.from(x, 'base64')
        const banner = Buffer.from(y, 'base64')
        return { name, description, category, icon, banner }
      })
    })
    // await page.click('._primaryButton_7jap0_6')
    fs.writeFileSync('ListOfRetroPFG2.json', JSON.stringify(data))
    console.log(data)
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    await browser.close()
  }
}

getinfo()
