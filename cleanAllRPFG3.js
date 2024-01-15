import fs from 'fs'
import dataInelgiblerpgf3 from './metadatarpgf3.json' assert { type: 'json' }
import dataEligiblerpgf3 from './test_result_rpgf3.json' assert { type: 'json' }
import address from './metadataAddress.json' assert { type: 'json' }

let finalData1 = []
let tempData = []
let finalData2 = []
let mergeData = []

for (let [index, value] of dataInelgiblerpgf3.entries()) {
  //   const newAddress = address[index].substring(60, 102)
  const newAddress1 = address[index]
  const newAddress2 = newAddress1.substring(60, 102)
  const newObj = {
    ...value,
    metadataPtr: newAddress1,
    address: newAddress2,
    statusReview: 'remove',
    statusRPGF3: 'ineligible',
    ballot: null,
    median: null,
    scaled: null,
    rank: null,
  }
  console.log(newAddress1, newAddress2)
  finalData1.push(newObj)
}

for (let [index, value] of finalData1.entries()) {
  let duplicate = false

  for (let each of dataEligiblerpgf3) {
    if (value['projectId'] === each['projectId']) {
      duplicate = true
    }
  }
  if (duplicate === false) {
    let newStatus = 'ineligible'
    if (value.ballot >= 17 && value.scaled != 0) {
      newStatus = 'eligible'
    }
    const newObj = {
      ...value,
      statusReview: 'pass',
      statusRPGF3: newStatus,
    }
    tempData.push(newObj)
  }
}
finalData2 = [...dataEligiblerpgf3, ...tempData]
console.log(finalData1.length, finalData2.length)
mergeData = [...finalData1, ...finalData2]
// function removeBackslashesAndNewlines(obj) {
//   const result = {}

//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       const value = obj[key]

//       if (typeof value === 'string') {
//         // Replace backslashes and newlines globally in the string
//         result[key] = value.replace(/\\ /g, '').replace(/\\n/g, '')
//       } else if (typeof value === 'object' && value !== null) {
//         // Recursively remove backslashes and newlines from nested objects
//         result[key] = removeBackslashesAndNewlines(value)
//       } else {
//         // For non-string and non-object values, just copy as is
//         result[key] = value
//       }
//     }
//   }

//   return result
// }

// for (let i = 0; i < dataEligiblerpgf3.length; i++) {
//   const objectWithoutBackslashesAndNewlines = removeBackslashesAndNewlines(
//     dataEligiblerpgf3[i]
//   )
//   console.log(objectWithoutBackslashesAndNewlines)
//   finalData2.push(objectWithoutBackslashesAndNewlines)
// }

fs.writeFileSync('finalDataRPGF3_1.json', JSON.stringify(finalData1, null, 2))
fs.writeFileSync('finalDataRPGF3_2.json', JSON.stringify(finalData2, null, 2))
fs.writeFileSync('finalDataRPGF3.json', JSON.stringify(mergeData, null, 2))
