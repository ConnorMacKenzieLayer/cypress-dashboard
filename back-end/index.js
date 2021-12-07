const path = require('path');
const express = require('express');
const { formatTestSuiteResults, formatTestResults } = require("./modules/testResults/formatTestResults.js");
const { listVideos, getTestSuiteResults } = require("./modules/fileOperations/getFiles.js");
const { copyDirectory } = require("./modules/fileOperations/ssh.js");
const app = express()
const port = 3001
const FRONT_END_PATH = path.join(__dirname, '..', 'front-end', 'build')

app.use(express.json());

app.use(express.static(FRONT_END_PATH));

app.get('/:jobUuid/videos', function(req, res, next){
    let jobUuid = req.params.jobUuid;
    let src = 'cypress/videos'
    let dest = `/var/tmp/${jobUuid}/cypress/videos`
    let videos;

    copyDirectory(src, dest, jobUuid).then(() => {
        videos = listVideos(dest);
    }).finally(() => res.send(videos));
});

app.get('/:jobUuid/videos/:videoFile', function(req, res, next){
    let jobUuid = req.params.jobUuid;
    let file = `/var/tmp/${jobUuid}/cypress/videos/${req.params.videoFile}`
    res.sendFile(file);
});

app.get('/:jobUuid/test-list', function(req, res, next){
    let formattedResults = {};
    let jobUuid = req.params.jobUuid;
    let src = 'cypress/results'
    let dest = `/var/tmp/${jobUuid}/cypress/results`

    copyDirectory(src, dest, jobUuid).then(() => {
        let testSuiteResults = getTestSuiteResults(`/var/tmp/${jobUuid}/cypress/results/`)
        formattedResults = formatTestSuiteResults(testSuiteResults)
    }).finally(() => res.send(formattedResults));
});

app.get('/:jobUuid/test-details/:testName', function(req, res, next){
    let formattedResults = {};
    let jobUuid = req.params.jobUuid;
    let src = 'cypress/results'
    let dest = `/var/tmp/${jobUuid}/cypress/results`

    copyDirectory(src, dest, jobUuid).then(() => {
        let testSuiteResults = getTestSuiteResults(`/var/tmp/${jobUuid}/cypress/results/`)
        formattedResults = formatTestResults(testSuiteResults, req.params.testName)
    }).finally(() => res.send(formattedResults));
});

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: FRONT_END_PATH});
});

app.listen(port, () => {
    console.log(`Cypress Dashboard listening at http://localhost:${port}`)
})
