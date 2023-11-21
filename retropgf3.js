import fs from 'fs'
import fetchData from './retropgf3.json' assert { type: 'json' }

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
    jsonData.table.rows.forEach((row) => {
      let obj = {}
      row.c.forEach((cell, index) => {
        if (cell && cell.v) {
          if (
            jsonData.table.cols[index].label === 'displayName' ||
            jsonData.table.cols[index].label === 'Approval Attestation ID' ||
            jsonData.table.cols[index].label === 'New Main-Category'
          ) {
            obj[jsonData.table.cols[index].label] = cell.v
          }
        }
      })
      fetchData.push(obj)
    })
  } catch (err) {
    console.error(err)
  } finally {
    fs.writeFileSync('retropgf3.json', JSON.stringify(fetchData))
  }
}

let countBallotFetch = 0

const fetchBallot = async () => {
  for (let i = 0; i < fetchData.length; i++) {
    const each = fetchData[i]
    console.log(each.displayName, each['Approval Attestation ID'])
    try {
      const query = {
        query:
          'query RetroPGFApplicationPageRouteQuery(\n  $id: ID!\n) {\n  retroPGF {\n    project(id: $id) {\n      id\n      ...RetroPGFApplicationBannerFragment\n      ...RetroPGFApplicationContentFragment\n    }\n  }\n}\n\nfragment ENSAvatarFragment on ResolvedName {\n  name\n}\n\nfragment NounResolvedLinkFragment on ResolvedName {\n  address\n  ...NounResolvedNameFragment\n}\n\nfragment NounResolvedNameFragment on ResolvedName {\n  address\n  name\n}\n\nfragment RetroPGFAddProjectToBallotModalContentFragment on Project {\n  id\n  ...RetroPGFModalApplicationRowFragment\n}\n\nfragment RetroPGFApplicationBannerFragment on Project {\n  id\n  bio\n  impactCategory\n  displayName\n  websiteUrl\n  applicant {\n    address {\n      address\n      resolvedName {\n        ...NounResolvedLinkFragment\n      }\n    }\n    id\n  }\n  applicantType\n  profile {\n    profileImageUrl\n    bannerImageUrl\n    id\n  }\n  includedInBallots\n  ...RetroPGFAddProjectToBallotModalContentFragment\n}\n\nfragment RetroPGFApplicationContentContributionLinkFragment on ContributionLink {\n  type\n  url\n  description\n}\n\nfragment RetroPGFApplicationContentFragment on Project {\n  impactDescription\n  contributionDescription\n  contributionLinks {\n    ...RetroPGFApplicationContentContributionLinkFragment\n  }\n  impactMetrics {\n    ...RetroPGFApplicationContentImpactMetricFragment\n  }\n  ...RetroPGFApplicationContentFundingSourceFragment\n  ...RetroPGFApplicationListContainerFragment\n}\n\nfragment RetroPGFApplicationContentFundingSourceFragment on Project {\n  fundingSources {\n    type\n    currency\n    amount\n    description\n  }\n}\n\nfragment RetroPGFApplicationContentImpactMetricFragment on ImpactMetric {\n  description\n  number\n  url\n}\n\nfragment RetroPGFApplicationListContainerFragment on Project {\n  lists {\n    ...RetroPGFListRowFragment\n    id\n  }\n}\n\nfragment RetroPGFListRowFragment on List {\n  id\n  author {\n    resolvedName {\n      ...NounResolvedNameFragment\n      ...ENSAvatarFragment\n    }\n  }\n  listName\n  listDescription\n  categories\n  listContent {\n    project {\n      displayName\n      profile {\n        profileImageUrl\n        id\n      }\n      id\n    }\n  }\n}\n\nfragment RetroPGFModalApplicationRowFragment on Project {\n  displayName\n  bio\n  profile {\n    profileImageUrl\n    id\n  }\n}\n',
        variables: {
          id: each['Approval Attestation ID'],
        },
      }

      const rawData = await fetch('https://vote.optimism.io/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(query),
      })

      const newData = await rawData.json()
      const totalBallots = newData.data.retroPGF.project.includedInBallots

      // Create a new object with the existing data and the ballot count
      const { displayName, ...rest } = each
      fetchData[i] = { ...rest, name: displayName, value: totalBallots }
      // Log the updated data
      console.log(fetchData[i])
    } catch (err) {
      console.error(err)
      // Retry after a delay in case of an error
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } finally {
      countBallotFetch++
      console.log(countBallotFetch)
    }
  }
}

const categoriesFilter = () => {
  const opStackData = fetchData
    .filter((each) => each['New Main-Category'] === 'OP_Stack')
    .map(
      ({ 'Approval Attestation ID': x, 'New Main-Category': y, ...rest }) =>
        rest
    )

  const collectiveGovernanceData = fetchData
    .filter((each) => each['New Main-Category'] === 'Collective_Governance')
    .map(
      ({ 'Approval Attestation ID': x, 'New Main-Category': y, ...rest }) =>
        rest
    )

  const developerEcosystemData = fetchData
    .filter((each) => each['New Main-Category'] === 'Developer_Ecosystem')
    .map(
      ({ 'Approval Attestation ID': x, 'New Main-Category': y, ...rest }) =>
        rest
    )

  const endUserExperienceAdoptionData = fetchData
    .filter(
      (each) => each['New Main-Category'] === 'End_User_Experience_Adoption'
    )
    .map(
      ({ 'Approval Attestation ID': x, 'New Main-Category': y, ...rest }) =>
        rest
    )

  fs.writeFileSync('opStackData.json', JSON.stringify(opStackData))
  fs.writeFileSync(
    'collectiveGovernanceData.json',
    JSON.stringify(collectiveGovernanceData)
  )
  fs.writeFileSync(
    'developerEcosystemData.json',
    JSON.stringify(developerEcosystemData)
  )
  fs.writeFileSync(
    'endUserExperienceAdoptionData.json',
    JSON.stringify(endUserExperienceAdoptionData)
  )
}

const wait = async () => {
  await fetchBallot()
  await categoriesFilter()
}

wait()
