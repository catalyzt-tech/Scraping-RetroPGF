// Fetch issues from the Ethereum Optimism Ecosystem Contributions repository
let allIssues = []
let flagOut = false
let page = 1

async function fetchIssues() {
  try {
    while (!flagOut) {
      const response = await fetch(
        `https://api.github.com/repos/ethereum-optimism/ecosystem-contributions/issues?per_page=100&page=${page}`
      )

      if (response.status !== 200) {
        flagOut = true
        break
      }

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
  console.log(allIssues.length)
}

fetchData()
