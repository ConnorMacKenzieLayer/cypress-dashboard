import React, {useEffect, useState} from 'react';
import {Box, Button, CardMedia, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import SuiteResults from "./SuiteResults";
import {ChevronLeft} from "react-feather";

export default function SpecDetails() {
    const [specResults, setSpecResults] = useState({});
    const { jobUuid, specUuid } = useParams();

    useEffect(() => {
        fetch(`/${jobUuid}/spec-details/${specUuid}`)
            .then(x => x.json())
            .then(x => setSpecResults(x))
            .catch(e => console.error(e));
    }, [jobUuid, specUuid]);

    return(
        <Box margin={5}>
            {
                (specResults && specResults.uuid) ? <>
                    <Box margin={5} display="flex" flexDirection="row">
                        <Box>
                            <Button
                                href={`/${jobUuid}`}
                                startIcon={<ChevronLeft color="#373737"/>}
                                sx={{
                                    color: "#373737"
                                }}
                            >
                                Back
                            </Button>
                        </Box>
                        <Box justifyContent="center" style={{width: "100%"}}>
                            <Typography variant="h4">
                                {specResults.file}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex">
                        <Box
                            margin={3}
                            display="flex"
                            flexDirection="column"
                            maxHeight="500px"
                            overflow="auto"
                            minWidth="50vw"
                        >
                            {specResults.suites.map(suite => {
                                return(
                                    <SuiteResults key={suite.uuid} suite={suite}/>
                                );
                            })}
                        </Box>
                        <Box
                            display="flex"
                            flexGrow={1}
                            padding={3}
                            alignContent="center"
                            justifyContent="center"
                            minWidth="33vw"
                        >
                            <CardMedia
                                component="video"
                                controls
                                src={`/video/${jobUuid}/${specResults.file}.mp4`}
                            />
                        </Box>
                    </Box>
                </> : null
            }
        </Box>
    );
}