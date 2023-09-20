import data1 from './result_rpgf1/rpgf1_1.json' assert { type: 'json' }
import data2 from './result_rpgf1/rpgf1_2.json' assert { type: 'json' }
import fs from 'fs'

const matchedData = []
const unmatchedData = []

for (let each of data1) {
  let count = 0
  for (let each2 of data2) {
    if (each['Project Name'] === each2.name) {
      count++
      const combinedData = { ...each, allocation: each2.allocation.slice(1) }
      matchedData.push(combinedData)
    }
  }
  if (count === 0) {
    unmatchedData.push(each['Project Name'])
  }
}

// console.log('Unmatched Data:', unmatchedData)
// console.log('Unmatched Data:', unmatchedData.length)
fs.writeFileSync(`./results_rpgf1.json`, JSON.stringify(matchedData), 'utf-8')
