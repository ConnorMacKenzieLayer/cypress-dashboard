import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";

export default function TestDetails() {
    const [testResults, setTestResults] = useState({});
    const [error, setError] = useState(false);
    const { jobUuid, testName } = useParams();

    console.log(error);

    useEffect(() => {
        async function fetchTestResults() {
            try {
                const res = await fetch(`/${jobUuid}/test/${testName}`)
                const result = await res.json()
                setTestResults(result)
                setError(false)
            } catch (err) {
                console.error(err)
                setError(true)
            }
        }

        fetchTestResults()
    }, [jobUuid]);

    return(
        <Box margin={5}>
            <Paper>
                {
                    (testResults && testResults.tests) ? <>
                        <Box>
                            <Typography variant="h3">
                                {testResults.name}
                            </Typography>
                        </Box>
                        <Box margin={3} display="flex" flexDirection="row" justifyContent="center">
                            <Box margin={3}>
                                Passed: {testResults.passed}
                            </Box>
                            <Box margin={3}>
                                Failed: {testResults.failures}
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column">
                            {testResults.tests.map(test => {
                                return(
                                    <Box key={test.name} margin={3} display="flex" flexDirection="row" justifyContent="space-between">
                                        <Box>
                                            <Typography>
                                                {test.name}
                                            </Typography>
                                        </Box>
                                        {test.failure ? <>
                                            <Box>
                                                <Typography>
                                                    {test.failure.type}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography>
                                                    {test.failure.message}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography>
                                                    {test.failure.$t}
                                                </Typography>
                                            </Box>
                                            </>: <>
                                                <Typography>
                                                    Passed
                                                </Typography>
                                            </>
                                        }
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