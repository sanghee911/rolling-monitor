'use strict';

const express = require('express');
const os = require('os');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// const apiServerIP = GetEnvironmentVar('API_SERVER_IP', 'http://35.200.62.214:8080');
const apiServerIP = GetEnvironmentVar('API_SERVER_IP', 'http://localhost:8001');
const namespace = GetEnvironmentVar('NAMESPACE', 'yje4zd-2-7-1');
// const namespace = GetEnvironmentVar('NAMESPACE', 'default');

// App
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));


app.get('/', (req, res) => {
    res.render('index', {
        'apiServerIP': apiServerIP,
        'namespace': namespace
    });
});


function GetEnvironmentVar(varname, defaultvalue) {
    var result = process.env[varname];
    if (result != undefined)
        return result;
    else
        return defaultvalue;
}


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
// console.log(apiServerIP);

