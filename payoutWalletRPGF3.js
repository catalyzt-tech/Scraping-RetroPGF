import Data from './finalDataRPGF3_2.json' assert { type: 'json' }
import fs from 'fs'

const tempData = []
const fetchData = async () => {
  for (let i of Data) {
    tempData.push(i.payoutAddress)
  }
  await fs.writeFileSync('payoutRPGF3.json', JSON.stringify(tempData, null, 2))
}
fetchData()
