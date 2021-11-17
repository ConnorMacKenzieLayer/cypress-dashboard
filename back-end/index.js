const path = require('path');
const express = require('express');
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const parser = require('xml2json');
const app = express()
const port = 3001
const FRONT_END_PATH = path.join(__dirname, '..', 'front-end', 'build')

const cypressDest = '/tmp/cypress';
const cypressSrc = 'cypress';

app.use(express.json());

app.use(express.static(FRONT_END_PATH));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/:jobUuid/test-list', function(req, res, next){
    let formattedResults = {}
    copyDirectory(req.params.jobUuid).then(() => {
        let testSuiteResults = getTestSuiteResults(cypressDest + '/results/')
        formattedResults = formatTestSuiteResults(testSuiteResults)
    }).finally(() => res.send(formattedResults))
});

app.get('/:jobUuid/test-details/:testName', function(req, res, next){
    let formattedResults = {}
    copyDirectory(req.params.jobUuid).then(() => {
        let testSuiteResults = getTestSuiteResults(cypressDest + '/results/')
        formattedResults = formatTestResults(testSuiteResults, req.params.testName)
    }).finally(() => res.send(formattedResults))
});

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: FRONT_END_PATH});
});

app.listen(port, () => {
    console.log(`Cypress Dashboard listening at http://localhost:${port}`)
})

function getTestSuiteResults(testResultsDirectory) {
    let json = [];

    let testResultsPaths = fs.readdirSync(testResultsDirectory).map(file => {
        return testResultsDirectory + file;
    });

    testResultsPaths.forEach(fileName => {
        let data = fs.readFileSync(fileName)
        let results = parser.toJson(data, {object: true});
        json.push(results)
    });

    return json;
}

async function copyDirectory(jobUuid) {
    const sftp = new Client();

    try {
        await sftp.connect({
            host: `${jobUuid}.lan`,
            username: 'root',
            password: 'password'
        });
        sftp.on('download', info => {
            console.log(`Listener: Download ${info.source}`);
        });
        let result = await sftp.downloadDir(cypressSrc, cypressDest);
        return result;
    } finally {
        await sftp.end();
    }
}

function copyTestResults(jobUuid) {
    copyDirectory(jobUuid)
        .then(msg => {
            console.log(msg);
        })
        .catch(err => {
            console.log(`main error: ${err.message}`);
        });
}

function formatTestSuiteResults(testSuiteResults) {
    let results = {
        totalInfo: {
            duration: 0.0,
            failures: 0,
            passed: 0,
        },
        testSuites: []
    }

    testSuiteResults.forEach(specResults => {
        let testSpec = specResults["testsuites"];

        let totalTests = parseInt(testSpec["tests"]);
        let totalFailures = parseInt(testSpec["failures"]);
        let totalPassed = totalTests - totalFailures;
        let totalDuration = parseFloat(testSpec["time"]);

        results.totalInfo.duration += totalDuration
        results.totalInfo.failures += totalFailures
        results.totalInfo.passed += totalPassed

        let testSuites = testSpec["testsuite"]

        testSuites.filter(testSuite =>
            testSuite["name"] !== "Root Suite"
        ).forEach( testSuite => {
            let name = testSuite["name"];
            let tests = parseInt(testSuite["tests"]);
            let failures = parseInt(testSuite["failures"]);
            let passed = tests - failures;
            let duration = parseFloat(testSuite["time"]);

            let testSuiteResult = {
                duration: duration,
                failures: failures,
                name: name,
                passed: passed
            }

            results.testSuites.push(testSuiteResult)
        });
    });

    return results;
}

function formatTestResults(testSuiteResults, testSuiteName) {
    let results = {
        duration: 0.0,
        failures: 0,
        name: "",
        passed: 0,
        tests: []
    }

    let testSuite;

    testSuiteResults.forEach(specResults => {
        let testSpec = specResults["testsuites"];
        let testSuites = testSpec["testsuite"];

        let result = testSuites.find(testSuite =>
            testSuite["name"] == testSuiteName
        );

        if(result) {
            testSuite = result;
            return;
        }
    });

    if(testSuite) {
        let name = testSuite["name"];
        let tests = parseInt(testSuite["tests"]);
        let failures = parseInt(testSuite["failures"]);
        let passed = tests - failures;
        let duration = parseFloat(testSuite["time"]);

        results.name = name;
        results.duration += duration;
        results.failures += failures;
        results.passed += passed;
        results.tests = testSuite["testcase"]
    }

    return results;
}