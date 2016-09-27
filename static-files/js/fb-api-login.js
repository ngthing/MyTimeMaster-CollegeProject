/**
 * Created by thinguyen on 9/25/16.
 */
// Integrate Facebook API here
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        loggedInSeccessful();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
   }
   // else {
    //     // The person is not logged into Facebook, so we're not sure if
    //     // they are logged into this app or not.
    //     document.getElementById('status').innerHTML = 'Log ' +
    //         'into Facebook.';
    // }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '165781817203603',
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use graph api version 2.5
    });

    // Now that we've initialized the JavaScript SDK, we call
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function loggedInSeccessful() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        $('header h1').text(response.name + ', you successfully sign up!');
        $('#sign-up-tab').hide();
        $('#sign-in-tab').hide();
        $('form').hide();
        $("#sign-out-tab").text('Sign out');
        $("#profile").text(response.name);
        var imageUrl = 'http://graph.facebook.com/' + response.id + '/picture?type=large';
        $("#pic").attr({
            "src": imageUrl,
            "style": "border-radius: 20px;"});
        $('#next-step').html("<h4>Next Step:</h4>");
        $('#next-step').append('<a href="calendar.html" class="btn btn-info" role="button">Provide your Calendar</a>');
        $('#next-step').append("<h4>Or</h4>");
        $('#next-step').append('<a href="create-events.html" class="btn btn-info" role="button">Create New Events</a>');

    });
}

function logout() {
    FB.getLoginStatus(function (response) {
        if (response && response.status === 'connected') {
            FB.logout(function (response) {
                // user is now logged out
                console.log("user loggout ?");
                console.log(response);
                window.location.reload();
            });
        }
    });
}
