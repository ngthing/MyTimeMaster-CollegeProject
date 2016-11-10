/**
 * Created by thinguyen on 10/10/16.
 */
"use strict";
var config = {
    apiKey: "AIzaSyAWoy65K87hcXNTgbcW_wRa9-Sw3zwHi70",
    authDomain: "mytimemaster.firebaseapp.com",
    databaseURL: "https://mytimemaster.firebaseio.com",
    storageBucket: "mytimemaster.appspot.com",
    messagingSenderId: "17686327988"
};
firebase.initializeApp(config);
// var converter = new Showdown.converter();
var userName;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("Signed in");
        $("#firebaseui-auth-container").hide();
        $("#intro").hide();
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var providerData = user.providerData;
        var accessToken= user.accessToken;
        userName = user.uid;
        ReactDOM.render(<EventBox />, document.getElementById('content'));


        user.getToken().then(function(accessToken) {

            document.getElementById('sign-in-status').textContent = "Welcome, " + displayName;
            // document.getElementById('account-details').textContent = JSON.stringify({
            //     displayName: displayName,
            //     email: email,
            //     emailVerified: emailVerified,
            //     photoURL: photoURL,
            //     uid: uid,
            //     accessToken: accessToken,
            //     providerData: providerData
            // }, null, '  ');
        });

        // document.getElementById('account-details').hide();
        // D3js for chart here
// Get a database reference to our posts
        var eventsBoxRef = firebase.database().ref('eventsBox').child(userName);

        eventsBoxRef.on('value', function(snapshot) {
            var data = [];
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                data.push(childData);
            });
            // console.log("data " +data);
            var width = 420,
                barHeight = 20;

            var x = d3.scale.linear()
                .domain([0, d3.max(data)])
                .range([0, width]);

            var chart = d3.select(".chart")
                .attr("width", width)
                .attr("height", barHeight * data.length);

            var bar = chart.selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

            bar.append("rect")
                .attr("width", function(d){ return d.hours*100;})
                .attr("height", barHeight - 1);

            bar.append("text")
                .attr("x", function(d,i) { return d.hours*100 - d.hours*10; })
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function(d) { return d.name + " for " + d.hours + "hrs";});
        });


    } else {
        // User is signed out.
        $("#sign-in-status").hide();
        $("#signout").hide();
        // FirebaseUI config.
        var uiConfig = {
            'signInSuccessUrl': '/', //URL that we get sent BACK to after logging in
            'signInOptions': [
                // Leave the lines as is for the providers you want to offer your users.

                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//            firebase.auth.GithubAuthProvider.PROVIDER_ID,
//                    firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            'tosUrl': '<your-tos-url>',
        };
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
        $("#content").hide();
        $("#chart").hide();
        $("#pickDate").hide();
        $("#intro").show();
        $("#firebaseui-auth-container").show();
    }
}, function(error) {
    console.log(error);
});

// Event, EventList, EventForm, EventBox
var Event = React.createClass({
    render: function() {
        // var rawMarkup = converter.makeHtml(this.props.children.toString());
        //onClick={this.props.removeEvent.bind(null, this.props.index)}
        //onClick={this.props.event.removeEvent.bind(null, this.props.event['.key'])}
        return (
            <div className='event'>
                <h4 className='name'><button onClick={this.props.delEvent.bind(null, this.props.event['.key'])}>&#x2716;</button>
                    {this.props.event.name}. For: {this.props.event.hours} hours.
                </h4>

                {/*<span dangerouslySetInnerHTML={{__html: rawMarkup}} />*/}
            </div>
        );
    }
});

var EventList = React.createClass({
    render: function() {
        var removeEvent= this.props.removeEvent;
        var eventNodes = this.props.data.filter(function(value){
            // console.log("Comparing "  + " with");
            // console.log(value);
            //Only include those that are 1 hour
            // if(value.hours == 1)
            //     return true;
            // else
            // {
            //     console.log("Filter " + value.hours);
            //     return false;
            // }
            return true
        }).map(function (event, index) {
            return <Event index={index} event={event} delEvent={removeEvent}></Event>;
        });
        return <div className='eventList'>{eventNodes}</div>;

    }
});

var EventForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.refs.name.value.trim();
        var hours = this.refs.hours.value;
        this.props.onEventSubmit({name: name, hours: hours});
        this.refs.name.value = '';
        this.refs.hours.value = '';
    },
    render: function() {
        return (
            <form className='eventForm' onSubmit={this.handleSubmit}>
                <br/><h5>Add a new Event:</h5>
                <input type='text' placeholder='Event name' ref='name' required/>
                <br/>Duration (in hours):
                <input type="number" ref="hours" min="0.25" max="10" step="any" placeholder='min 0.25 - max 10' required />
                <br/><input type='submit' value='Save' />
            </form>
        );
    }
});
var EventBox = React.createClass({
    mixins: [ReactFireMixin],

    handleEventSubmit: function(event) {
        // Here we push the update out to Firebase and let ReactFire update this.state.data
        // console.log("event.name" +event.name);
        // console.log("event.hours" +event.hours);
        // this.firebaseRefs['data'].push(event);
        firebase.auth().currentUser.getToken().then(function(idToken) {
            $.ajax({
                type: "POST",
                url: "/event",
                data: {name: event.name, hours: event.hours, token: idToken},
            });
        });
        console.log("Date: " + this.state.filterDate);
        console.log("event.name " +event.name);
        console.log("event.hours " +event.hours);
    },

    getInitialState: function() {
        return {
            data: [],
            filterDate: null
        };
    },

    componentWillMount: function() {
        // Here we bind the component to Firebase and it handles all data updates,
        // no need to poll as in the React example.
        // console.log("data sent to firebase " + data);
        // this.fireRef = firebase.database().ref('users').child(userName);
        // this.bindAsArray(this.fireRef, "items");
        // this.fireRef = firebase.database().ref('users').child(userName);
        //  this.bindAsArray(firebase.database().ref('eventsBox'), 'data');
        //  this.bindAsArray(this.fireRef.ref('eventsBox'), 'data');
        // this.bindAsArray(this.fireRef, 'data');
        console.log("Looking for userName: " + userName);
        this.bindAsArray(firebase.database().ref('eventsBox').child(userName), 'data');
        console.log(firebase.database().ref('eventsBox').child(userName).once("value",function(val){
        }));
    },
    removeEvent: function (key) {
        firebase.auth().currentUser.getToken().then(function(idToken) {
            console.log("token" + idToken);
            $.ajax({
                url: "/event",
                type: 'DELETE',
                data: {key: key, token: idToken}
            });
        });
    },
    filterDate : function(dateToShow){
        //set filterDAte to be the date that the user selected
        //FilterDate is used when new event is created to select what date to make
        //FilterDate is used in list render to
        //then call this.setstate(data...)
    },

    render: function() {
        return (
            <div className='eventBox'>
                <h1>Your events today</h1>
                <EventList data={this.state.data} removeEvent={this.removeEvent}/>
                <EventForm onEventSubmit={this.handleEventSubmit} />
            </div>
        );
    }
});


