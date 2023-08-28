import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
})

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

let linkArray = []
linkArray = await page.$$eval('a._container_1dvyk_1', (links) =>
  links.map((a) => a.href)
)
// console.log(linkArray)
let temp = []
for (let each of linkArray) {
  const eachpage = await browser.newPage()
  await eachpage.goto(each)
  // await eachpage.waitForSelector('._header_bb8mr_1', { timeout: 5000 })
  await eachpage.waitForTimeout(5000)
  const name = await eachpage.$eval('h1._header_bb8mr_1', (h1) =>
    h1 ? h1.textContent : 'Null'
  )
  const about = await eachpage.$eval(
    '._content_i25cn_54 > section:nth-child(4) > p',
    (p) => (p ? p.innerText : 'Null')
  )
  const question_1 = await eachpage.$eval(
    '._content_i25cn_54 > section:nth-child(6) > p:nth-child(3)',
    (p) => (p ? p.innerText : 'Null')
  )
  const question_2 = await eachpage.$eval(
    '._content_i25cn_54 > section:nth-child(7) > p:nth-child(3)',
    (p) => (p ? p.innerText : 'Null')
  )
  const team = await eachpage.$eval(
    '._content_i25cn_54 > section:nth-child(8) > p:nth-child(2)',
    (p) => (p ? p.innerText : 'Null')
  )
  await temp.push({ name, about, question_1, question_2, team })
  await console.log(temp)
  await eachpage.close()
}
await browser.close()
