import data1 from './results.json' assert { type: 'json' }
import fs from 'fs'

fs.readdirSync('./each_project').forEach((eachProjectFolder) => {
  console.log(eachProjectFolder)
  const data2 = JSON.parse(
    fs.readFileSync(`./each_project/${eachProjectFolder}/info.json`)
  )
  data1.forEach((eachData1Item) => {
    try {
      if (eachData1Item['Project Name'] === data2.name) {
        const { 'OP Received': OP, ...other } = eachData1Item
        const newData = {
          ...data2,
          'OP Allocation': OP,
        }
        console.log(newData)
        fs.writeFileSync(
          `./each_project/${eachProjectFolder}/info.json`,
          JSON.stringify(newData)
        )
      }
    } catch (e) {
      console.log(e)
    }
  })
})
