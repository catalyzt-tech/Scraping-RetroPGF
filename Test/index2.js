import fs from 'fs'
import OP from '/result_op/result.json'
const impScrap = () => {
  const scrap = []
  try {
    const list = fs.readdirSync('./result_scrap')
    for (const folder of list) {
      const subList = fs.readdirSync(`./result_scrap/${folder}`)
      for (const subFolder of subList) {
        const targetPath = `./result_scrap/${folder}/${subFolder}`
        if (fs.existsSync(targetPath) && subFolder === 'info.json') {
          const targetContent = fs.readFileSync(targetPath, 'utf8')
          const targetParsed = JSON.parse(targetContent)
          scrap.push(targetParsed)
          console.log(targetParsed)
        }
      }
    }
  } catch (err) {
    console.log('The error is ' + err)
  }
}
const impOP = () => {}
