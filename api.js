const easyvk = require('easyvk')

class API {
    constructor(token){
        this.token = token;
    }

    init() {
        return new Promise((resolve, reject) => {
        easyvk({
            token: this.token,
            utils: {
                userAgent: "KateMobileAndroid/45 lite-421 (Android 5.0; SDK 21; armeabi-v7a; LENOVO Lenovo A1000; ru)"
            },
            userAgent: ""
          }).then(vk => {
            this.vk = vk;
            resolve(true);
          })
        });
    }

    getAll(cfg = {}) {
        return new Promise((resolve, reject) => {
            this.vk.call("audio.get", cfg, 'get', false, {
                userAgent: "KateMobileAndroid/45 lite-421 (Android 5.0; SDK 21; armeabi-v7a; LENOVO Lenovo A1000; ru)"
            }).then((resp) => {
                resolve(resp);
            }).catch((error) => {
                reject(error);
                console.log(error);
            });
        })
    }

    getAudios(audios) {
        return new Promise((resolve, reject) => {
            this.vk.call("audio.getById", {
                audios: audios.join(",")
            }, 'get', false, {
                userAgent: "KateMobileAndroid/45 lite-421 (Android 5.0; SDK 21; armeabi-v7a; LENOVO Lenovo A1000; ru)"
            }).then((resp) => {
                resolve(resp);
            }).catch((error) => {
                reject(error);
                console.log(error);
            });
        })
    }

    getProfile(id) {
        return new Promise((resolve, reject) => {
            this.vk.call("users.get", {
                user_ids: id,
                fields: 'photo_50'
            }).then((resp) => {
                resolve(resp[0]);
            }).catch((error) => {
                reject(error);
                console.log(error);
            });
        })
    }
};

module.exports = API;