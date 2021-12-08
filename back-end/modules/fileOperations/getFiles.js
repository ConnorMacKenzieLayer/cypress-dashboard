const fs = require("fs");
const parser = require("xml2json");
const path = require("path");

const getTestSuiteResults = (testResultsDirectory) => {
    let json = [];
    let testResultsPaths;
    try {
        testResultsPaths = fs.readdirSync(testResultsDirectory).map(file => {
            if(path.extname(file) === ".xml") {
                return path.join(testResultsDirectory, file);
            }
        });
    } catch (err) {
        console.error(err);
        return json;
    }


    testResultsPaths.forEach(fileName => {
        let data;
        try {
            data = fs.readFileSync(fileName)
            let results = parser.toJson(data, {object: true});
            json.push(results)
        } catch (err) {
            console.error(err);
            return;
        }
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