import React, {useEffect, useState} from 'react';
import {Box, Button, Typography} from "@mui/material";
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
        <Box margin={3}>
            {
                (testResults && testResults.totalInfo) ? <>
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
                                    Passed: {testResults.totalInfo.passed}
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
                                    Failures: {testResults.totalInfo.failures}
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" width="30vw"/>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        {testResults.testSuites.map(testSuite => {
                            return(
                                <Box
                                    key={testSuite.name}
                                    margin={2}
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    padding={3}
                                    sx={{
                                        border: 1,
                                        borderLeft: 10,
                                        borderColor: testSuite.failures === 0 ? '#258271' : '#C65858'
                                    }}
                                >
                                    <Box display="flex" width="25%">
                                        <Typography>
                                            {testSuite.name}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" width="25%" justifyContent="right">
                                        <Typography>
                                            Passed: {testSuite.passed}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" width="25%" justifyContent="right">
                                        <Typography>
                                            Failures: {testSuite.failures}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" width="25%" justifyContent="right">
                                        <Button
                                            variant="outlined"
                                            style={{
                                                color: testSuite.failures === 0 ? '#258271' : '#C65858',
                                                borderColor: testSuite.failures === 0 ? '#258271' : '#C65858',
                                                textTransform: "none"
                                            }}
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
        </Box>
    );
}