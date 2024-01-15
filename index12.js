import fs from 'fs'
import data from './metadatarpgf3.json' assert { type: 'json' }

const projectIdArr = []
for (const i of data) {
  projectIdArr.push(i.projectId)
}
fs.writeFileSync('projectIdArr.json', JSON.stringify(projectIdArr, null, 2))
