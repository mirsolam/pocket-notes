const express = require('express');
const app = express();
const port = 3500;

app.get('/', (req, res) => {
    res.send('Hello pocket notes.')
});

app.listen(port, () => {
    console.log("Listening")
});