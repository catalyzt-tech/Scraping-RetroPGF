import fs from 'fs'
import data from './githubIssues.json' assert { type: 'json' }
let cleanData = []
for (let i of data) {
  //   const tagNew = [...i.labels]
  //   console.log(tagNew)
  const obj = {
    url: i.html_url,
    issue_number: i.number,
    title: i.title,
    user: {
      name: i.user.login,
      avatar: i.user.avatar_url,
    },
    tag: i.labels.map((each) => ({
      name: each.name,
      desctiion: each.description,
    })),

    body: i.body,
    created_at: i.created_at,
    updated_at: i.updated_at,
    comment: i.comments,
    reaction: i.reactions,
    status: i.state,
  }
  cleanData.push(obj)
}
console.log(cleanData.length)
fs.writeFileSync('cleanIssue.json', JSON.stringify(cleanData, null, 2))
