let fetchData = []
let temp1 = 0
let temp2 = 0

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
    console.error(err)
  } finally {
    fetchData.forEach((each) => {
      if (each.applicantType.toLowercase() === 'project') {
        temp1++
      } else if (each.applicantType.toLowercase() === 'individual') {
        temp2++
      }
    })
  }
}
const run = async () => {
  await fetchSheet()
  console.log(
    'Project ' + temp1 + ' ' + ((temp1 * 100) / 643).toFixed(2) + '%',
    'Individual ' + temp2 + ' ' + ((temp2 * 100) / 643).toFixed(2) + '%'
  )
}
run()
