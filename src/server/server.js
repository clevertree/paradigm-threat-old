const express = require('express');


const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
app.use(express.static(__dirname));

const httpPort = 8070;
app.listen(httpPort, function() {
    console.log('Paradigm Threat Server listening on port: ' + httpPort);
});