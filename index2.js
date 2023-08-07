import fs from 'fs'
import OP from './result_op/results.json' assert { type: 'json' }

const scrap = []
const impScrap = () => {
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
          // console.log(targetParsed)
        }
      }
    }
  } catch (err) {
    console.log('The error is ' + err)
  }
}
impScrap()
const tempsave = []
for (let each of scrap) {
  for (let i = 0; i < OP.length; i++) {
    if (each.name === OP[i]['Project Name']) {
      each = {
        ...each,
        votedominance: OP[i]['% of votes received'],
        totalop: OP[i]['OP Received'],
      }
      tempsave.push(each)
      // console.log(each)
    }
  }
}
// console.log(scrap)

for (let each of tempsave) {
  const cleanName = each.name
  console.log(each)
  fs.writeFileSync(
    `./result_scrap/${cleanName}/info.json`,
    JSON.stringify(each)
  )
}
