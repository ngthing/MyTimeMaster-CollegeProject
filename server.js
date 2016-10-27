/**
 * Created by thinguyen on 10/27/16.
 */
var express = require('express');
var gcloud = require('google-cloud');
var firebase = require('firebase');
var multer = require("multer");
var uploader = multer({ storage: multer.memoryStorage({}) });
var app = express();
var port = process.env.PORT || 4000;

var counter = 0;
app.get('/', function (req, res) {
    res.send('Hello World has been said ' + counter + ' times!');
    counter++;
});

app.listen(port, function () {
    console.log('Example app listening on port' + port);
});

app.use(express.static('public')); // App load static files e.i. html, css, js
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});