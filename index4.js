import data1x from './csvjson.json' assert { type: 'json' }
import data2x from './csvjson-2.json' assert { type: 'json' }
import fs from 'fs'

const data1 = data1x
const data2 = data2x

// console.log(data1)
// console.log(data2)
const matchedData = []
const unmatchedData = []
let count = 0

for (let each of data1) {
  for (let each2 of data2) {
    if (each.name === each2.name) {
      count++
      const combinedData = { ...each, allocation: each2.allocation }
      matchedData.push(combinedData)
    }
  }
  if (count == 0) {
    unmatchedData.push(each.name)
  }
}

matchedData.forEach((combinedData) => {
  fs.mkdir(
    `./result_rpgf1/${combinedData.name}`,
    { recursive: true },
    (err) => {
      if (err) {
        console.error(`Error creating directory: ${err}`)
      } else {
        fs.writeFileSync(
          `./result_rpgf1/${combinedData.name}/info.json`,
          JSON.stringify(combinedData)
        )
      }
    }
  )
})
console.log(unmatchedData)
