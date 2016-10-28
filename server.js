/**
 * Created by thinguyen on 10/27/16.
 */
var express = require('express');
var firebase = require('firebase');
var multer = require("multer");
var gcloud = require('google-cloud');

var app = express();
var port = Number(process.env.PORT || 3000);
var counter = 0;

firebase.initializeApp({
    serviceAccount: "MyTimeMaster-07379faeb028.json",
    databaseURL: "https://mytimemaster.firebaseio.com"
});


app.get('/', function (req, res) {
    res.send('Hello World has been said ' + counter + ' times!');
    counter++;
});

app.listen(port);

app.use(express.static('public')); // App load static files e.i. html, css, js


