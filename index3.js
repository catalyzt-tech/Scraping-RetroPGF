import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
})

try {
  const page = await browser.newPage()
  await page.goto(
    'https://app.optimism.io/retropgf-discovery/0xB30dD1198Feed1e22EC969f61EEd04cB75937adf'
  )
  await page.waitForTimeout(5000)
  let temp = []
  const scrap = async () => {
    const name = await page.$eval('h1._header_bb8mr_1', (h1) => h1.textContent)
    const about = await page.$eval(
      '._content_i25cn_54 > section:nth-child(4) >p',
      (p) => p.innerText
    )
    const question_1 = await page.$eval(
      '._content_i25cn_54 > section:nth-child(6)>p:nth-child(3)',
      (p) => p.innerText
    )
    const question_2 = await page.$eval(
      '._content_i25cn_54 > section:nth-child(7)>p:nth-child(3)',
      (p) => p.innerText
    )
    const team = await page.$eval(
      '._content_i25cn_54 > section:nth-child(8)>p:nth-child(2)',
      (p) => p.innerText
    )
    temp.push({ name, about, question_1, question_2, team })
    console.log(temp)
  }

  await scrap()
} catch (error) {
  console.error('An error occurred: ' + error)
} finally {
  console.log('Done Scraping')
  await browser.close()
}
