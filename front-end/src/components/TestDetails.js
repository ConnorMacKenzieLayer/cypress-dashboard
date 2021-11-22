import React, {useEffect, useState} from 'react';
import {Box, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import TestResults from "./TestResults";

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
        <Box margin={5}>
            <Paper>
                {
                    (testResults && testResults.name) ? <>
                        <Box>
                            <Typography variant="h4">
                                {testResults.name}
                            </Typography>
                        </Box>
                        <Box display="flex">
                            <Box
                                margin={3}
                                display="flex"
                                flexDirection="column"
                                maxHeight="500px"
                                overflow="auto"
                            >
                                {testResults.failedTests.map(test => {
                                    return(
                                        <TestResults key={test.name} test={test}/>
                                    );
                                })}
                            </Box>
                        </Box>
                    </> : null
                }
            </Paper>
        </Box>
    );
}