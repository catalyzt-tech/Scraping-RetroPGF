import fs from 'fs'
import result from './rpgf3_result.json' assert { type: 'json' }
let fetchData = []
let fetchDataNew = []
let finalData = []
const fetchSheet = async () => {
  try {
    let query = encodeURIComponent('Select *')
    let sheet = 'Metadata_full'
    const sheetID = '13ihSoZycgH2h6ZvlARuj7q2zPvGtBqQ8LoNrJemTUU4'
    let data = await fetch(
      `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheet}&tq=${query}`
    )
    data = await data.text()
    let jsonData = await JSON.parse(data.slice(47, -2))
    await jsonData.table.rows.forEach(async (row) => {
      let obj = {}
      row.c.forEach((cell, index) => {
        if (cell) {
          if (cell.v) {
            obj[jsonData.table.cols[index].label] = cell.v
          }
        }
      })
      fetchData.push(obj)
    })
  } catch (err) {
    console.log(err)
  } finally {
    fetchDataNew = fetchData
    // console.log(fetchDataNew.length)
  }
}

const resultData = async () => {
  for (let each of fetchDataNew) {
    for (let each2 of result) {
      console.log(each['Approval Attestation ID'], each2['project_id'])
      if (each['Approval Attestation ID'] === each2['project_id']) {
        const { votes_count, median_amount, scaled_amount, ...left } = each2
        const newObj = {
          ...each,
          ballot: votes_count,
          median: median_amount,
          scaled: scaled_amount,
        }
        finalData.push(newObj)
      }
    }
  }
  console.log(finalData.length)
  fs.writeFileSync('test_result_rpgf3.json', JSON.stringify(finalData))
}

const mergeData = async () => {
  await fetchSheet()
  await resultData()
}

mergeData()
