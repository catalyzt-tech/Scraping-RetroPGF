import puppeteer from 'puppeteer'
import fs from 'fs'
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
  await eachpage.waitForTimeout(5000)
  const icon64 = await eachpage.$eval('._image_bb8mr_10', (img) => img.src)
  const icon = Buffer.from(icon64.slice(22), 'base64')
  let banner64, banner
  try {
    banner64 = await eachpage.$eval('._banner_i25cn_46 > img', (img) => img.src)
    banner = Buffer.from(banner64.slice(22), 'base64')
  } catch (err) {
    banner = null
  }
  const name = await eachpage.$eval('h1._header_bb8mr_1', (h1) =>
    h1 ? h1.textContent : 'Null'
  )
  const twitterElement = await eachpage.$(
    'div._container_1gcg6_1 > a:nth-child(1)'
  )
  const twitter = twitterElement
    ? await twitterElement.evaluate((a) => a.href)
    : 'Null'

  const githubElement = await eachpage.$(
    'div._container_1gcg6_1 > a:nth-child(2)'
  )
  const github = githubElement
    ? await githubElement.evaluate((a) => a.href)
    : 'Null'

  const websiteElement = await eachpage.$(
    'div._container_1gcg6_1 > a:nth-child(3)'
  )

  const website = websiteElement
    ? await websiteElement.evaluate((a) => a.href)
    : 'Null'
  const aboutElement = await eachpage.$(
    '._content_i25cn_54 > section:nth-child(4) > p'
  )
  const about = aboutElement
    ? await aboutElement.evaluate((p) => p.innerText)
    : 'Null'

  const question_1Element = await eachpage.$(
    '._content_i25cn_54 > section:nth-child(6) > p:nth-child(3)'
  )
  const question_1 = question_1Element
    ? await question_1Element.evaluate((p) => p.innerText)
    : 'Null'

  const question_2Element = await eachpage.$(
    '._content_i25cn_54 > section:nth-child(7) > p:nth-child(3)'
  )
  const question_2 = question_2Element
    ? await question_2Element.evaluate((p) => p.innerText)
    : 'Null'

  const teamElement = await eachpage.$(
    '._content_i25cn_54 > section:nth-child(8) > p:nth-child(2)'
  )
  const team = teamElement
    ? await teamElement.evaluate((p) => p.innerText)
    : 'Null'
  await fs.mkdirSync(`each_project/${name}`, { recursive: true })
  await fs.writeFileSync(
    `each_project/${name}/info.json`,
    JSON.stringify({
      name,
      twitter,
      github,
      website,
      about,
      question_1,
      question_2,
      team,
    })
  )
  await fs.writeFileSync(`each_project/${name}/icon.jpg`, icon, 'binary')
  if (banner) {
    await fs.writeFileSync(`each_project/${name}/banner.jpg`, banner, 'binary')
  }
  await temp.push({
    name,
    twitter,
    github,
    website,
    about,
    question_1,
    question_2,
    team,
  })
  await console.log(temp)
  await eachpage.close()
}
await browser.close()
