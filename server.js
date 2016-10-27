/**
 * Created by thinguyen on 10/27/16.
 */
var http = require('http');
var server = http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello from MyTimeMaster</h1>');

});
var port = Number(process.env.PORT || 3000);
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
}
app.use(express.static('public')); // App load static files e.i. html, css, js

// var express = require('express');
// var gcloud = require('google-cloud');
// var firebase = require('firebase');
// var multer = require("multer");
// var uploader = multer({ storage: multer.memoryStorage({}) });
// var app = express();
// var port = process.env.PORT || 3000;
// var bodyParser = require('body-parser')
//
// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));
//
//
// var counter = 0;
// app.get('/', function (req, res) {
//     res.send('Hello World has been said ' + counter + ' times!');
//     counter++;
// });
//
// app.listen(port, function () {
//     console.log('Example app listening on port ' + port + '!');
// });