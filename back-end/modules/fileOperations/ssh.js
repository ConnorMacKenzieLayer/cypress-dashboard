const Client = require('ssh2-sftp-client');
const fetch = require("node-fetch");
const fs = require("fs");

const getIpAdress = async (jobUuid) => {
    let result = "";
    await fetch(`http://webapp.io/pluginapi/job/${jobUuid}/runner_ips`)
        .then(x => x.json())
        .then(runners => {
            let runner = runners.find(runner => {
                if(runner["layerfile_path"].includes("cypress")){
                    return runner["running_pod_ip4"] !== "" && runner["Status"] === 'RUNNING';
                }
                return false;
            })

            result = runner ? runner["running_pod_ip4"] : "";
        })
        .catch(e => {
            console.error(e)
        });

    return result;
}

const deleteDirectory = (dest) => {
    try {
        fs.rmdirSync(dest, {recursive: true});
    } catch (e) {
        console.error(e);
    }
    fs.rmdirSync(dest, {recursive: true});
}

const copyDirectory = async (src, dest, jobUuid) => {
    let ip =  await getIpAdress(jobUuid)

    if (ip === "") {
        console.warn("No IP found");
        return;
    }

    const sftp = new Client();

    fs.mkdirSync(dest, {recursive: true});

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

        await sftp.end();

        return result;
    } catch (err) {
        console.error(err);
        deleteDirectory(dest);
    }
}

module.exports = { copyDirectory }