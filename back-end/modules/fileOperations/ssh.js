const Client = require('ssh2-sftp-client');
const fetch = require("node-fetch");
const fs = require("fs");

const getIpAdress = async (jobUuid) => {
    let result = "";
    await fetch(`http://webapp.io/pluginapi/job/${jobUuid}/runner_ips`)
        .then(x => x.json())
        .then(runners => {
            runners.forEach(runner => {
                if(runner["layerfile_path"].includes("cypress")){
                    result = runner["running_pod_ip4"];
                }
            })
        })
        .catch(e => {
            console.error(e)
        });

    return result;
}

const copyDirectory = async (src, dest, jobUuid) => {
    let ip =  await getIpAdress(jobUuid)

    console.log(ip);

    if (ip === "") {
        return;
    }

    const sftp = new Client();

    fs.mkdir(dest, {recursive: true}, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    try {
        await sftp.connect({
            host: ip,
            port: '22',
            username: 'root',
            password: 'password'
        });
        sftp.on('download', info => {
            console.log(`Listener: Download ${info.source}`);
        });

        let result = await sftp.downloadDir(src, dest);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        await sftp.end();
    }
}

module.exports = { copyDirectory }