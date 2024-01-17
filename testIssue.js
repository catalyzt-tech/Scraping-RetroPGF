// Fetch issues from the Ethereum Optimism Ecosystem Contributions repository
import fs from 'fs'
let allIssues = []
// let flagOut = false
let page = 1

async function fetchIssues() {
  try {
    while (page <= 10) {
      const accessToken =
        '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'
      const response = await fetch(
        `https://api.github.com/repos/ethereum-optimism/ecosystem-contributions/issues?per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      //   await console.log(response.length)
      if (response.status !== 200) {
        // flagOut = true
        break
      }
      console.log(`Fetching page ${page}..., ${response.status}`)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch issues: ${response.status} ${response.statusText}`
        )
      }

      const issues = await response.json()
      allIssues = [...allIssues, ...issues]
      page++
    }
  } catch (error) {
    console.error('Error fetching issues:', error)
  }
}

// Call the async function
const fetchData = async () => {
  await fetchIssues()
  await fs.writeFileSync('githubIssues.json', JSON.stringify(allIssues))
  console.log(allIssues.length)
}

fetchData()
