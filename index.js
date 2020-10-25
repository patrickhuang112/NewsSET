// Patrick Huang, 2020
const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');  

app.use(bodyParser.json());
app.use(express.static('static'));

// I am using an node/express server because News API has restrictions with the 
// basic plan if stuff is not done on a localhost.

// Main path
app.get ('/', (req, res) =>{
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Listening on part 8000 (Go to 'localhost:8000') in browser to see page
app.listen(PORT, () =>{
    console.log('Listening on port...');
});