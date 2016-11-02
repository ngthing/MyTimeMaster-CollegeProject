/**
 * Created by thinguyen on 10/27/16.
 */
var express = require('express');
var firebase = require('firebase');
var multer = require("multer");
var gcloud = require('google-cloud');
var bodyParser = require('body-parser');
var uploader = multer({ storage: multer.memoryStorage({}) });
var app = express();
var port = Number(process.env.PORT || 3000);


firebase.initializeApp({
    serviceAccount: "MyTimeMaster-07379faeb028.json",
    databaseURL: "https://mytimemaster.firebaseio.com"
});
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fireRef = firebase.database().ref('eventsBox');
app.post('/event', urlencodedParser, function(req, res){
    fireRef.push({"name":req.body.name, "hours" : req.body.hours}, function(){
        res.send("ok!");
    }).catch(function(){
        res.status(403);
        res.send();

    });
});


/**
 * Google cloud storage part
 */
var CLOUD_BUCKET="mytimemaster.appspot.com"; //From storage console, list of buckets
var gcs = gcloud.storage({
    projectId: '17686327988', //from storage console, then click settings, then "x-goog-project-id"
    keyFilename: 'MyTimeMaster-07379faeb028.json' //the key we already set up
});
var fireRef = firebase.database().ref('eventsBox');

function getPublicUrl (filename) {
    return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
}
var bucket = gcs.bucket(CLOUD_BUCKET);

//From https://cloud.google.com/nodejs/getting-started/using-cloud-storage
function sendUploadToGCS (req, res, next) {
    if (!req.file) {
        return next();
    }

    var gcsname = Date.now() + req.file.originalname;
    var file = bucket.file(gcsname);


    var stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on('error', function (err) {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', function () {
        req.file.cloudStorageObject = gcsname;
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        var options = {
            entity: 'allUsers',
            role: gcs.acl.READER_ROLE
        };
        file.acl.add(options, function(a,e){next();});//Make file world-readable; this is async so need to wait to return OK until its done
    });

    stream.end(req.file.buffer);
}

// Process uploaded pic
app.post('/pic', uploader.single("img"), sendUploadToGCS, function (req, res, next) {
    if(req.file)
    {
        var imgurl = getPublicUrl(req.file.cloudStorageObject);
        console.log("Img url at");
        console.log(imgurl);
        res.send(imgurl);
    }

});

app.listen(port, function () {
    console.log('App listening on port %s', port);
    console.log('Press Ctrl+C to quit.');
});

app.use(express.static('public')); // App load static files e.i. html, css, js


