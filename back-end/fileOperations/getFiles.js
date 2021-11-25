export default function getTestSuiteResults(testResultsDirectory) {
    let json = [];

    let testResultsPaths = fs.readdirSync(testResultsDirectory).map(file => {
        if(path.extname(file) === ".xml") {
            return testResultsDirectory + file;
        }
    });

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

export default function listVideos(videoDirectory) {
    return fs.readdirSync(videoDirectory).map(file => {
        if(path.extname(file) === ".mp4") {
            return file;
        }
    });
}