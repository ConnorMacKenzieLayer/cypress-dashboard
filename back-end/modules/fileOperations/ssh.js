const getIpAdress = async (jobUuid) => {
    fetch(`http://webapplocal.io/pluginapi/job/${jobUuid}/runner_ids`)
        .then(x => x.json())
        .then(runners => {
            runners.forEach(runner => {
                if(runner["layerfile_path"].includes("cypress")){
                    return runner["running_pod_ip4"];
                }
            })
        })
        .catch(e => {
            console.error(e)
            return "";
        });
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