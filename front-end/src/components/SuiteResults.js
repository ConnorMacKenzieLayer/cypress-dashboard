import React, {useState} from 'react';
import {Box, Button, Collapse, Typography} from "@mui/material";

export default function SuiteResults({test}) {
    const [collapseLogs, setCollapseLogs] = useState(false)

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
                    {test.name}
                </Typography>
                <Button
                    color="info"
                    onClick={() => {
                        console.log("clicked")
                        setCollapseLogs(!collapseLogs);
                    }}
                >
                    {collapseLogs ? "Collapse Stack Trace" : "Expand Stack Trace"}
                </Button>
            </Box>
            <Box display="flex" flexDirection="row" maxHeight="300px" overflow="auto">
                <Collapse
                    in={collapseLogs}
                    collapsedSize={100}
                >
                    <Typography
                        align="left"
                        sx={{
                            fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro", monospace',
                            fontSize: "small"
                        }}
                    >
                        {test.failure.$t}
                    </Typography>
                </Collapse>
            </Box>
        </Box>
    );
}