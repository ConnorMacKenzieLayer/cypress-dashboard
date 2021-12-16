const fs = require("fs");
const parser = require("xml2json");
const path = require("path");

const getTestSuiteResults = (testResultsDirectory) => {
    let json = [];
    let testResultsPaths = fs.readdirSync(testResultsDirectory).map(file => {
        if(path.extname(file) === ".xml") {
            return path.join(testResultsDirectory, file);
        }
    });

    testResultsPaths.forEach(fileName => {
        let data = fs.readFileSync(fileName)
        let results = parser.toJson(data, {object: true});
        json.push(results)
    });

    return json;
}

const listVideos = (videoDirectory) => {
    return fs.readdirSync(videoDirectory).map(file => {
        if(path.extname(file) === ".mp4") {
            return file;
        }
    });
}

module.exports = {getTestSuiteResults, listVideos}