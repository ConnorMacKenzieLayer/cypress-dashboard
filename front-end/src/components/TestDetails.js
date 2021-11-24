import React, {useEffect, useState} from 'react';
import {Box, IconButton, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {ChevronLeft} from "react-feather";

const PassedTestResult = ({test}) => {
    return(
        <Box
            key={test.name}
            margin={3}
            padding={3}
            display="flex"
            justifyContent="space-between"
            sx={{
                border: 1,
                borderLeft: 10,
                borderColor: '#258271'
            }}
        >
            <Typography variant="h5">
                {test.classname}
            </Typography>
        </Box>
    );
}

const FailedTestResult = ({test}) => {
    return(
        <Box
            key={test.name}
            margin={3}
            padding={3}
            display="flex"
            flexDirection="column"
            sx={{
                border: 1,
                borderLeft: 10,
                borderColor: '#C65858'
            }}
        >
            <Box
                display="flex"
                flexDirection="row"
                marginBottom={3}
                justifyContent="space-between"
            >
                <Typography variant="h5">
                    {test.classname}
                </Typography>
            </Box>
            <Box display="flex" flexDirection="row" maxHeight="300px" overflow="auto">
                <Typography
                    align="left"
                    sx={{
                        fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro", monospace',
                        fontSize: "small"
                    }}
                >
                    {test.failure.$t}
                </Typography>
            </Box>
        </Box>
    );
}

export default function TestDetails() {
    const [testResults, setTestResults] = useState({});
    const { jobUuid, testName } = useParams();

    useEffect(() => {
        fetch(`/${jobUuid}/test-details/${testName}`)
            .then(x => x.json())
            .then(x => setTestResults(x))
            .catch(e => console.error(e));
    }, [jobUuid, testName]);

    return(
        <Box margin={3}>
            {
                (testResults && testResults.name) ? <>
                    <Box margin={3} display="flex" flexDirection="row">
                        <Box>
                            <IconButton
                                href={`/${jobUuid}`}
                            >
                                <ChevronLeft color="#373737"/>
                            </IconButton>
                        </Box>
                        <Box justifyContent="center" style={{width: "100%"}}>
                            <Typography variant="h4">
                                {testResults.name}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="Row">
                        <Box
                            margin={3}
                            display="flex"
                            flexDirection="column"
                            maxHeight="500px"
                            overflow="auto"
                        >
                            {testResults.failedTests.map(test => {
                                return(
                                    <FailedTestResult key={test.name} test={test}/>
                                );
                            })}

                            {testResults.passedTests.map(test => {
                                return(
                                    <PassedTestResult key={test.name} test={test}/>
                                );
                            })}
                        </Box>
                        <Box
                            margin={3}
                            display="flex"
                            flexDirection="column"
                        >
                            <Typography variant="h6">
                                Videos
                            </Typography>
                        </Box>
                    </Box>
                </> : null
            }
        </Box>
    );
}