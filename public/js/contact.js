/**
 * Created by thinguyen on 11/9/16.
 */
$(document).ready(function() {

// Initialize Firebase
    "use strict";
    var config = {
        apiKey: "AIzaSyAWoy65K87hcXNTgbcW_wRa9-Sw3zwHi70",
        authDomain: "mytimemaster.firebaseapp.com",
        databaseURL: "https://mytimemaster.firebaseio.com",
        storageBucket: "mytimemaster.appspot.com",
        messagingSenderId: "17686327988"
    };
    firebase.initializeApp(config);
    // This not quite work yet because only authenticated server can write to firebase.
    $(function () {
        //make a variable to keep track of the data coming from Firebase

        //create a new connection to firebase
        var commentsRef = firebase.database().ref("comments");

        $('#newComment').submit(function (event) {
            var $form = $(this);
            var sender = $('#name').val();
            var email = $('#email').val();
            var comments = $('#comments').val();
            console.log(Date());
            //send the new data to Firebase
            commentsRef.push({
                sender: sender,
                email: email,
                comments: comments,
                time: Date()
            });

            //Show successfull message as a pop-up model
            $('#commentConfirm').html(
                "<p>Thanks, " + sender + " for your note! <br/> " +
                "We will get back to you as soon as we can. Have a great day! &#9752 </p>")
            $('#commentConfirm').show();
            //Clear form:
            document.getElementById('newComment').reset();
            //return false to prevent page from refreshing
            return false;
        });
    });
});