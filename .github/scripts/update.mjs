// import fetch from 'node-fetch'
// import { getOctokit, context } from '@actions/github'
//
// const UPDATE_TAG_NAME = 'updater'
// const UPDATE_FILE_NAME = 'update.json'
//
// const getSignature = async (url) => {
//     const response = await fetch(url, {
//         method: 'GET', headers: {
//             'Content-Type': 'application/octet-stream',
//             'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
//         }
//     })
//     return response.text()
// }
//
// const updateData = {
//     name: '',
//     pub_date: new Date().toISOString(),
//     platforms: {
//         win64: { signature: '', url: '' },
//         linux: { signature: '', url: '' },
//         darwin: { signature: '', url: '' },
//         'linux-x86_64': { signature: '', url: '' },
//         'windows-x86_64': { signature: '', url: '' },
//     },
// }
//
// const octokit = getOctokit(process.env.GITHUB_TOKEN)
// const options = { owner: context.repo.owner, repo: context.repo.repo }
//
// const { data: release } = await octokit.rest.repos.getLatestRelease(options)
// updateData.name = release.tag_name
// for (const { name, browser_download_url } of release.assets) {
//     const proxy_browser_download_url = 'https://ghproxy.com/' + browser_download_url
//     if (name.endsWith('.msi.zip')) {
//         updateData.platforms.win64.url = proxy_browser_download_url
//         updateData.platforms['windows-x86_64'].url = proxy_browser_download_url
//     } else if (name.endsWith('.msi.zip.sig')) {
//         const signature = await getSignature(browser_download_url)
//         updateData.platforms.win64.signature = signature
//         updateData.platforms['windows-x86_64'].signature = signature
//     } else if (name.endsWith('.app.tar.gz')) {
//         updateData.platforms.darwin.url = proxy_browser_download_url
//     } else if (name.endsWith('.app.tar.gz.sig')) {
//         const signature = await getSignature(browser_download_url)
//         updateData.platforms.darwin.signature = signature
//     } else if (name.endsWith('.AppImage.tar.gz')) {
//         updateData.platforms.linux.url = proxy_browser_download_url
//         updateData.platforms['linux-x86_64'].url = proxy_browser_download_url
//     } else if (name.endsWith('.AppImage.tar.gz.sig')) {
//         const signature = await getSignature(browser_download_url)
//         updateData.platforms.linux.signature = signature
//         updateData.platforms['linux-x86_64'].signature = signature
//     }
// }
//
// const { data: updater } = await octokit.rest.repos.getReleaseByTag({ ...options, tag: UPDATE_TAG_NAME })
//
// for (const { id, name } of updater.assets) {
//     if (name === UPDATE_FILE_NAME) {
//         await octokit.rest.repos.deleteReleaseAsset({ ...options, asset_id: id })
//         break
//     }
// }
//
// await octokit.rest.repos.uploadReleaseAsset({
//     ...options,
//     release_id: updater.id,
//     name: UPDATE_FILE_NAME,
//     data: JSON.stringify(updateData),
// })
