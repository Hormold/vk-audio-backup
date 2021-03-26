process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});
require('dotenv').config();
const path = require('path')
const fs = require('fs');
const TOKEN = process.env["TOKEN"];
const COUNT = process.env["COUNT"] || 6000;
if(!TOKEN) {
    console.log('Token not found!')
    process.exit();
}


const downloader = require('./downloader');
const Downloader = new downloader(TOKEN, COUNT);

(async () => {
    await Downloader.init();
    await Downloader.loadAudios();
    await Downloader.processList();
})();