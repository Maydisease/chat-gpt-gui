import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const getSignature = async (url) => {
    return await fetch(url, {
        method: 'GET', headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN,
        }
    }).then((response) => response.text())
}

(async function () {
    const address = 'https://api.github.com/repos/Maydisease/chat-gpt-gui/releases';
    const response = await fetch('https://api.github.com/repos/Maydisease/chat-gpt-gui/releases').then((res) => res.json())
    // console.log('response[0]:', response[0].assets)
    // if()

    const tarGzRegx = new RegExp(/tar.gz$/);
    const tarGzSigRegx = new RegExp(/tar.gz.sig$/);

    const version = response[0].tag_name.replace('app-v', '');
    const notes = response[0].body;
    const publishedAt = response[0].published_at;

    const uploaderBody = {
        url: "",
        version: version, // app-v1.0.3
        notes: notes,
        pub_date: publishedAt,
        signature: ""
    }

    for (let asset of response[0].assets) {
        if (tarGzRegx.test(asset.name)) {
            uploaderBody.url = asset.browser_download_url;
            uploaderBody.pub_date = asset.updated_at;
        }
        if (tarGzSigRegx.test(asset.name)) {
            uploaderBody.signature = await getSignature(asset.browser_download_url);
        }
    }

    fs.writeFileSync(path.join('.','uploader', 'uploader.json'), JSON.stringify(uploaderBody));

    // console.log('uploaderBody:', uploaderBody);
}())


