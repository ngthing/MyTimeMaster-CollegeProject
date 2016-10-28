/**
 * Created by thinguyen on 10/27/16.
 */
var http = require('http');
var express = require('express');
var app = express();
var port = Number(process.env.PORT || 3000);
var counter = 0;
app.get('/', function (req, res) {
    res.send('Hello World has been said ' + counter + ' times!');
    counter++;
});

app.listen(port);

app.use(express.static('public')); // App load static files e.i. html, css, js


