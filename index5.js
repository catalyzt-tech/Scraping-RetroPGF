import data1x from './csvjson.json' assert { type: 'json' }
import data2x from './csvjson-2.json' assert { type: 'json' }
import fs from 'fs'

const data1 = data1x
const data2 = data2x

const matchedData = []
const unmatchedData = []

for (let each of data1) {
  let count = 0
  for (let each2 of data2) {
    if (each.name === each2.name) {
      count++
      const combinedData = { ...each, allocation: each2.allocation.slice(1) }
      matchedData.push(combinedData)
    }
  }
  if (count === 0) {
    unmatchedData.push(each.name)
  }
}

fs.writeFileSync(`./results_rpgf1.json`, JSON.stringify(matchedData), 'utf-8')

// console.log('Matched Data:', matchedData)
// console.log('Unmatched Data:', unmatchedData)
