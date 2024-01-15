import fs from 'fs'
import dataInelgiblerpgf3 from './metadatarpgf3.json' assert { type: 'json' }
import dataEligiblerpgf3 from './test_result_rpgf3.json' assert { type: 'json' }
import address from './metadataAddress.json' assert { type: 'json' }

let finalData1 = []
let finalData2 = []

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

fs.writeFileSync('finalDataRPGF3_1.json', JSON.stringify(finalData1, null, 2))
fs.writeFileSync(
  'finalDataRPGF3_2.json',
  JSON.stringify(dataEligiblerpgf3, null, 2)
)
