import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";

export default function TestList() {
    const [testResults, setTestResults] = useState({});
    const [error, setError] = useState(false);
    const { jobUuid } = useParams();

    console.log(error)

    useEffect(() => {
        async function fetchTestResults() {
            try {
                const res = await fetch(`/${jobUuid}/test-list/`)
                const result = await res.json()
                setTestResults(result)
                setError(false)
            } catch (err) {
                console.error(err)
                setError(true)
            }
        }

        fetchTestResults()
    }, [jobUuid])

    return(
        <Box margin={5}>
            <Paper>
                {
                    (testResults && testResults.totalInfo) ? <>
                        <Box margin={3} display="flex" flexDirection="row" justifyContent="center">
                            <Box margin={3}>
                                Passed: {testResults.totalInfo.passed}
                            </Box>
                            <Box margin={3}>
                                Failures: {testResults.totalInfo.failures}
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column">
                            {testResults.testSuites.map(testSuite => {
                                return(
                                    <Box key={testSuite.name} margin={3} display="flex" flexDirection="row" justifyContent="space-between">
                                        <Box>
                                            <Typography>
                                                {testSuite.name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography>
                                                Passed: {testSuite.passed}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography>
                                                Failures: {testSuite.failures}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                href={`/${jobUuid}/test/${testSuite.name}`}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </> : null
                }

            </Paper>
        </Box>
    );
}