let reg = /(\/[a-zA-Z0-9]{1,30})(\/audios)?\/([a-zA-Z0-9]{1,30})(\/index\.m3u8)/;
const api = require('./api');
const path = require('path')
const fs = require('fs');
let justUpdate = process.env['UPDATE'] ? true:false;
const request = require('request')


class Downloader {
    constructor(TOKEN, COUNT = 6000) {
        console.log('Inited... Loading list of audios')
        try {
            this.COUNT = COUNT;
            this.API = new api(TOKEN);
           
        } catch (err) {
            console.log('API INIT ERROR');
            process.exit();
        }
    }

    async init() {
        await this.API.init();
        this.i = 0;
    }

    async loadAudios() {
        try {
            this.resp = await this.API.getAll(justUpdate?{count: 100}:{count: this.COUNT});
            this.items = this.resp.items;
            console.log(`Loaded: ${this.items.length} audios (v3)`)
        } catch (err) {
            console.log('API LOADING ERROR: '+err.toString());
            process.exit();
        }
    }

    async processList() {
        if(!this.items.length) {
            console.log('Not found items...');
            process.exit();
        }
        for(let item of this.items) {
            try{
               await this.processOneNode(item);
            } catch (err) {
                this.i++;
                console.log(`Error with ${item.artist} - ${item.title}: ${err.toString()}`)
            }
        }
    }

    async processOneNode(item) {
        let url = item.url;
        if(!url) {
            console.log(`Not found url? ${JSON.stringify(item)}`)
            return;
        }
        const m = reg.exec(url);
        if(m && typeof m === "object" && m.hasOwnProperty(4)) {
            url = url.replace(m[1], '');
            url = url.replace(m[4], '.mp3');
        }
        let coreName = `${item.artist} - ${item.title}`
        coreName = coreName.replace(/\/|'|:|"|\?|!/g, '_');
        const fn = `${coreName}.mp3`;
        const fpath = path.join(__dirname, 'content','audio', fn);
        const fn2 = `${coreName}.json`;
        const path2 = path.join(__dirname, 'content','audio_meta', fn2);
        if(!fs.existsSync(fpath)) {
            await this.downloadFile(fpath, url);
            await fs.writeFileSync(path2, JSON.stringify(item))
        }
        this.i++;
        console.log(`Done: ${this.i}/${this.items.length}`)
    }

    async downloadFile(fp, url) {
        return new Promise((resolve, reject) => {
            try {
                const file = fs.createWriteStream(fp);
                request(url)
                .pipe(file)
                .on('close', () => {
                    resolve();
                    console.log(`Downloading finished to ${fp}!`)

                })
                
            } catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = Downloader;