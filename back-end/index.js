const path = require('path');
const express = require('express')
const app = express()
const port = 3001
const FRONT_END_PATH = path.join(__dirname, '..', 'front-end', 'build')

app.use(express.json());

app.use(express.static(FRONT_END_PATH));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Cypress Dashboard listening at http://localhost:${port}`)
})