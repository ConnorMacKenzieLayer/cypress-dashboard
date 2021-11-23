import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";

export default function TestList() {
    const [testResults, setTestResults] = useState({});
    const { jobUuid } = useParams();

    useEffect(() => {
        fetch(`/${jobUuid}/test-list/`)
            .then(x => x.json())
            .then(x => setTestResults(x))
            .catch(e => console.error(e));
    }, [jobUuid])

    return(
        <Box margin={5}>
            <Paper>
                {
                    (testResults && testResults.testSpecs) ? <>
                        <Box margin={3} display="flex" flexDirection="row">
                            <Box display="flex" width="30vw"/>
                            <Box
                                display="flex"
                                flexGrow={1}
                                justifyContent="center"
                                flexDirection="row"
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        width: 300,
                                        height: 150,
                                        backgroundColor: '#258271',
                                        borderRadius: 5
                                    }}
                                >
                                    <Typography style={{color: "#FFFFFF"}} variant="h4">
                                        Passed: {testResults.stats.passes}
                                    </Typography>
                                </Box>
                                <Box
                                    marginLeft={5}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        width: 300,
                                        height: 150,
                                        backgroundColor: '#C65858',
                                        borderRadius: 5
                                    }}
                                >
                                    <Typography style={{color: "#FFFFFF"}} variant="h4">
                                        Failures: {testResults.stats.failures}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" width="30vw"/>
                        </Box>
                        <Box display="flex" flexDirection="column">
                            {testResults.testSpecs.map(testSpec => {
                                return(
                                    <Box
                                        key={testSpec.uuid}
                                        margin={2}
                                        display="flex"
                                        flexDirection="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        padding={3}
                                        sx={{
                                            border: 1,
                                            borderLeft: 10,
                                            borderColor: testSpec.failures === 0 ? '#258271' : '#C65858'
                                        }}
                                    >
                                        <Box display="flex" width="25%">
                                            <Typography>
                                                {testSpec.name}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" width="25%" justifyContent="right">
                                            <Typography>
                                                Passed: {testSpec.passed}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" width="25%" justifyContent="right">
                                            <Typography>
                                                Failures: {testSpec.failures}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" width="25%" justifyContent="right">
                                            <Button
                                                variant="outlined"
                                                style={{
                                                    color: testSpec.failures === 0 ? '#258271' : '#C65858',
                                                    borderColor: testSpec.failures === 0 ? '#258271' : '#C65858',
                                                    textTransform: "none"
                                                }}
                                                href={`/${jobUuid}/spec/${testSpec.uuid}`}
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