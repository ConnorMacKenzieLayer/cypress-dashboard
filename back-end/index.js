const path = require('path');
const express = require('express');
const fs = require("fs");
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
    let src = 'cypress/videos';
    let dest = `/var/tmp/${jobUuid}/cypress/videos`;
    let videos;

    if (fs.existsSync(dest)) {
        videos = listVideos(dest);
        res.send(videos);
    } else {
        copyDirectory(src, dest, jobUuid).then(() => {
            res.send(listVideos(dest));
        }).catch(err => {
            console.log(err);
            next(err);
        } );
    }
});

app.get('/:jobUuid/videos/:videoFile', function(req, res){
    let jobUuid = req.params.jobUuid;
    let file = `/var/tmp/${jobUuid}/cypress/videos/${req.params.videoFile}`;
    res.sendFile(file);
});

app.get('/:jobUuid/test-list', function(req, res, next){
    const formattedResults = (dir) => {
        let testSuiteResults = getTestSuiteResults(dir);
        return formatTestSuiteResults(testSuiteResults);
    };

    let jobUuid = req.params.jobUuid;
    let src = 'cypress/results';
    let dest = `/var/tmp/${jobUuid}/cypress/results`;

    if (fs.existsSync(dest)) {
        res.send(formattedResults(dest));
    } else {
        copyDirectory(src, dest, jobUuid)
            .then(() => {
                res.send(formattedResults(dest));
            }).catch(err => {
                console.error(err);
                next(err);
            });
    }
});

app.get('/:jobUuid/test-details/:testName', function(req, res, next){
    const formattedResults = (dir, testName) => {
        let testSuiteResults = getTestSuiteResults(dir);
        return formatTestResults(testSuiteResults, testName);
    };

    let jobUuid = req.params.jobUuid;
    let src = 'cypress/results';
    let dest = `/var/tmp/${jobUuid}/cypress/results`;

    if (fs.existsSync(dest)) {
        res.send(formattedResults(dest, req.params.testName));
    } else {
        copyDirectory(src, dest, jobUuid).then(() => {
            res.send(formattedResults(dest, req.params.testName));
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }
});

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: FRONT_END_PATH});
});

app.listen(port, () => {
    console.log(`Cypress Dashboard listening at http://localhost:${port}`)
})
