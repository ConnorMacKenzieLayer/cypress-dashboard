const path = require('path');
const express = require('express');
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const app = express()
const port = 3001
const FRONT_END_PATH = path.join(__dirname, '..', 'front-end', 'build')

app.use(express.json());

app.use("/video", express.static(__dirname + "/videos"))

app.get('/:jobUuid/test-list', function(req, res, next){
    let formattedResults = {};
    let jobUuid = req.params.jobUuid;

    copyDirectory(jobUuid).then(() => {
        let testSpecReports = getTestReportResults(`/var/tmp/${jobUuid}/cypress/`)
        formattedResults = formatTestReportResults(testSpecReports)
    }).finally(() => res.send(formattedResults));
});

app.get('/:jobUuid/spec-details/:specUuid', function(req, res, next){
    let formattedResults = {};
    let jobUuid = req.params.jobUuid;

    copyDirectory(jobUuid).then(() => {
        let testSpecReports = getTestReportResults(`/var/tmp/${jobUuid}/cypress/`)
        formattedResults = formatTestResults(testSpecReports, req.params.specUuid)
    }).finally(() => res.send(formattedResults));
});

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: FRONT_END_PATH});
});

app.listen(port, () => {
    console.log(`Cypress Dashboard listening at http://localhost:${port}`)
})

function getTestReportResults(testReportsDirectory) {
    let testReports = [];

    let testResultsPaths = fs.readdirSync(testReportsDirectory).map(file => {
        return testReportsDirectory + file;
    });

    testResultsPaths.forEach(fileName => {
        let data;
        try {
            data = fs.readFileSync(fileName)
        } catch (err) {
            console.error(err);
            return;
        }
        let report = JSON.parse(data);
        testReports.push(report)
    });

    return testReports;
}

async function copyDirectory(jobUuid) {
    const sftp = new Client();
    let src = 'cypress/results'
    let dest = `/var/tmp/${jobUuid}/cypress`

     fs.mkdir(dest, {recursive: true}, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });

    try {
        await sftp.connect({
            host: `${jobUuid}.lan`,
            username: 'root',
            password: 'password'
        });
        let result = await sftp.downloadDir(src, dest);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        await sftp.end();
    }

}

function formatTestReportResults(testSpecReports) {
    let results = {
        stats: {
            duration: 0.0,
            failures: 0,
            passes: 0,
        },
        testSpecs: []
    }

    testSpecReports.forEach(specReport => {
        let stats = specReport["stats"];

        let duration = stats["duration"];
        let failures = stats["failures"];
        let passed = stats["passes"];

        results.stats.duration += duration
        results.stats.failures += failures
        results.stats.passes += passed

        let specResults = specReport["results"]

        specResults.forEach( result => {
            let name = result["file"];
            let uuid = result["uuid"];

            let testSuiteResult = {
                duration: duration,
                failures: failures,
                name: name,
                passed: passed,
                uuid: uuid
            }

            results.testSpecs.push(testSuiteResult)
        });
    });

    return results;
}

function formatTestResults(testSpecReports, testSpecUuid) {
    let results = {
        file: "",
        uuid: "",
        duration: 0,
        failures: 0,
        passes: 0,
        suites: []
    }

    let specReport;

    testSpecReports.forEach(report => {
        let specResults = report["results"];

        let result = specResults.find(spec =>
            spec["uuid"] == testSpecUuid
        );

        if(result) {
            specReport = report;
            return;
        }
    });

    if(!specReport) {
        return {};
    }

    let stats = specReport["stats"];
    results.duration = stats["duration"];
    results.failures = stats["failures"];
    results.passes = stats["passes"];

    let specResults = specReport["results"][0];
    results.file = specResults["file"];
    results.uuid = specResults["uuid"];

    specResults["suites"].forEach(suite => {
        let suiteUuid = suite["uuid"];
        let title = suite["title"];
        let failures = [];
        let passes = [];

        suite["tests"].forEach(test => {
            if(test["fail"]){
                failures.push(test);
            } else {
                passes.push(test);
            }
        })

        results.suites.push(
            {
                uuid: suiteUuid,
                title: title,
                failures: failures,
                passes: passes
            }
        )
    });

    return results;
}