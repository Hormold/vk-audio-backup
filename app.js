require('dotenv').config();
const path = require('path')
const fs = require('fs');
const TOKEN = process.env["TOKEN"];
if(!TOKEN) {
    console.log('Token not found!')
    process.exit();
}
let justUpdate = process.env['UPDATE'] ? true:false;
const https = require('https')
const api = require('./api');
let reg = /(\/[a-zA-Z0-9]{1,30})(\/audios)?\/([a-zA-Z0-9]{1,30})(\/index\.m3u8)/;


(async () => {
    let API;
    try {
        API = new api(TOKEN);
        await API.init();
    } catch (err) {
        console.log('API INIT ERROR');
        process.exit();
    }
    let resp;
    try {
        resp = await API.getAll(justUpdate?{count: 100}:{});
    } catch (err) {
        console.log('API LOADING ERROR: '+err.toString());
        process.exit();
    }
    console.log(`Loaded: ${resp.items.length} audios`)
    let i = 0;
    for(let item of resp.items) {
        let url = item.url;
        const m = reg.exec(url);
        if(m[4]) {
            url = url.replace(m[1], '');
            url = url.replace(m[4], '.mp3');
        }
        const fn = `${item.artist} - ${item.title}.mp3`;
        const fpath = path.join(__dirname, 'content','audio', fn);
        const fn2 = `${item.artist} - ${item.title}.json`;
        const path2 = path.join(__dirname, 'content','audio_meta', fn2);
        if(!fs.existsSync(fpath)) {
            await downloadFile(fpath, url);
            await fs.writeFileSync(path2, JSON.stringify(item))
        }
        i++;
        console.log(`Done: ${i}/${resp.items.length}`)
    }
})();

async function downloadFile(fp, url) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fp);
        const request = https.get(
            url,
            function(response) {
                console.log(`Downloading finished to ${fp}!`)
                response.pipe(file);
                resolve();
            }
        );
    })
}