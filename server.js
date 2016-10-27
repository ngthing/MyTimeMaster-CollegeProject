/**
 * Created by thinguyen on 10/27/16.
 */
var express = require('express');
var gcloud = require('google-cloud');
var firebase = require('firebase');
var multer = require("multer");
var uploader = multer({ storage: multer.memoryStorage({}) });
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static('public')); // App load static files e.i. html, css, js
