import fs from 'fs'
const testdata = JSON.parse(fs.readFileSync('./TestData.json', 'utf-8'))

const changetoimg = () => {
  const data = testdata.forEach((item) => {
    const icon = Buffer.from(item.icon, 'binary')
    const banner = Buffer.from(item.banner, 'binary')
    const pathsaveicon = `${item.name}_icon.png`
    const pathsavebanner = `${item.name}_banner.png`
    fs.writeFileSync(pathsaveicon, icon, 'binary')
    fs.writeFileSync(pathsavebanner, banner, 'binary')
    // console.log(item.name + ' ' + item.category)
  })
}

changetoimg()
