import data1 from './rpgf1_1.json' assert { type: 'json' }
import data2 from './rpgf1_2.json' assert { type: 'json' }
import fs from 'fs'

const matchedData = []
const unmatchedData = []
let count = 0

for (let each of data1) {
  for (let each2 of data2) {
    if (each['Project Name'] === each2.name) {
      count++
      const {
        'Project Lead Full Name': Lead,
        'Why should this project receive retroactive public goods funding? (500 word max)':
          Question,
        ...other
      } = each
      const combinedData = {
        ...other,
        Leader: Lead,
        Question: Question,
        allocation: each2.allocation.slice(1),
      }
      console.log(combinedData)
      matchedData.push(combinedData)
    }
  }
  if (count == 0) {
    unmatchedData.push(each['Project Name'])
  }
}

matchedData.forEach((combinedData) => {
  fs.mkdir(
    `./result_rpgf1/${combinedData['Project Name']}`,
    { recursive: true },
    (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`)
      } else {
        fs.writeFileSync(
          `./result_rpgf1/${combinedData['Project Name']}/info.json`,
          JSON.stringify(combinedData)
        )
      }
    }
  )
})
console.log(unmatchedData)
