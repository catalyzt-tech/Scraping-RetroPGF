const sheetName = 'Sheet A'
const test = async () => {
  let query = encodeURIComponent('Select *')
  const sheetID = '1o1AZNEPiESrluvTEUBJgFqFWwI6G9xihGy3VL1ecNaQ'
  let data = await fetch(
    `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}&tq=${query}`
  )
  console.log(data.status)
  data = await data.text()
  let jsonData = await JSON.parse(data.slice(47, -2))
  console.log(jsonData)
  jsonData.table.cols.forEach((heading) => {
    if (heading.label) {
      console.log(heading.label.replace(/[^a-z0-9]/gi, '_').toLowerCase())
    }
  })
  jsonData.table.rows.forEach((row) => {
    let obj = {}
    row.c.forEach((cell, index) => {
      if (cell) {
        if (cell.v) {
          if (jsonData.table.cols[index].label == 'Twitter') {
            obj[
              jsonData.table.cols[index].label
            ] = `https://twiiter.com/${cell.v}`
          } else {
            obj[jsonData.table.cols[index].label] = cell.v
          }
        }
      }
    })
    console.log(obj)
  })
}

test()
// document.addEventListener('DOMContentLoaded', test)
