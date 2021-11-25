export default function formatTestResults(testSuiteResults, testSuiteName) {
    let results = {
        duration: 0.0,
        failures: 0,
        failedTests: [],
        name: "",
        passed: 0,
        passedTests: []
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

        testSuite["testcase"].forEach(test => {
            if(test.failure){
                results.failedTests.push(test);
            } else {
                results.passedTests.push(test);
            }
        });

        results.name = name;
        results.duration = duration;
        results.failures = failures;
        results.passed = passed;
    }

    return results;
}

export default function formatTestSuiteResults(testSuiteResults) {
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