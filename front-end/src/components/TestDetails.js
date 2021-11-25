import React, {useEffect, useState} from 'react';
import {Box, CardMedia, FormControl, IconButton, InputLabel, MenuItem, Select, Typography} from "@mui/material";
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
            minWidth="30vw"
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
            minWidth="30vw"
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
    const [videoList, setVideoList] = useState([])
    const [selectedVideo, setSelectedVideo] = useState("")
    const { jobUuid, testName } = useParams();

    useEffect(() => {
        fetch(`/${jobUuid}/test-details/${testName}`)
            .then(x => x.json())
            .then(x => setTestResults(x))
            .catch(e => console.error(e));
    }, [jobUuid, testName]);

    useEffect(() => {
        fetch(`/${jobUuid}/videos`)
            .then(x => x.json())
            .then(x => setVideoList(x))
            .catch(e => console.error(e));
    }, [jobUuid]);

    return(
        <Box margin={3}>
            {
                (testResults && testResults.name) ? <>
                    <Box margin={3} display="flex" flexDirection="row" justifyContent="center">
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
                    <Box display="flex" flexDirection="Row" justifyContent="center">
                        <Box
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
                            display="flex"
                            flexDirection="column"
                            padding={3}
                            alignContent="center"
                            justifyContent="center"
                            minWidth="33vw"
                        >
                            <Box>
                                <FormControl fullWidth>
                                    <InputLabel>Video</InputLabel>
                                    <Select
                                        label="Select Video"
                                        value={selectedVideo}
                                        onChange={(e) => {
                                            setSelectedVideo(e.target.value)
                                        }}
                                    >
                                        {videoList.map(video => {
                                            return <MenuItem key={video} value={video}> {video}</MenuItem>;
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box marginTop={3} maxWidth="40vw">
                                {
                                    selectedVideo === "" ? null
                                        : <CardMedia
                                            component="video"
                                            controls
                                            src={`/${jobUuid}/videos/${selectedVideo}`}
                                        />

                                }
                            </Box>
                        </Box>
                    </Box>
                </> : null
            }
        </Box>
    );
}