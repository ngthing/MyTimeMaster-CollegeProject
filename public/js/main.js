/**
 * Created by thinguyen on 10/10/16.
 */

// Initialize the Realtime Database JavaScript SDK
// Set up Firebase
"use strict";
var config = {
    apiKey: "AIzaSyAWoy65K87hcXNTgbcW_wRa9-Sw3zwHi70",
    authDomain: "mytimemaster.firebaseapp.com",
    databaseURL: "https://mytimemaster.firebaseio.com",
    storageBucket: "mytimemaster.appspot.com",
    messagingSenderId: "17686327988"
};
firebase.initializeApp(config);
var userName, displayName;
// Initialize the Facebook JavaScript SDK
FB.init({
    appId: '165781817203603',
    xfbml: true,
    status: true,
    cookie: true,
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // console.log("Signed in");
        $("#firebaseui-auth-container").hide();
        $("#intro").hide();
        // User is signed in.
        displayName = user.displayName;
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
        });
    } else {
        // User is signed out.
        $("#sign-in-status").hide();
        $("#signout").hide();
        // FirebaseUI config.
        var uiConfig = {
            'signInSuccessUrl': '/', //URL that we get sent BACK to after logging in
            'signInOptions': [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                // firebase.auth.EmailAuthProvider.PROVIDER_ID
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

// Global variables
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
//Global functions

// GetToday return an array of two presentation of the current date
function getToday(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var dayOfWeek = days[today.getDay()];
    var month = months[mm-1]
    if(dd<10) { dd='0'+dd; }
    if(mm<10) { mm='0'+mm; }
    today = mm+'-'+dd+'-'+ yyyy;
    var todayToDisplay =  dayOfWeek + ', ' + month + ' ' + dd +', ' +yyyy;
    var result = [today, todayToDisplay];
    return result;
}

// Update Time Chart is called when user want to view time chart in different day,
// or when user edit the EventList of the current date (e.i add new event or remove event)
function updateTimeChart(filterDate) {
    var chart = d3.select(".chart");
    // Remove the old chart
    d3.select(".chart").selectAll("g").remove();
    var eventsBoxRef = firebase.database().ref('eventsBox').child(userName);
    eventsBoxRef.on('value', function(snapshot) {
        var chart = d3.select(".chart");
        // Remove the old chart
        d3.select(".chart").selectAll("g").remove();
        var data = [];
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.date == filterDate) {
                data.push(childData);
            }
        });
        var i = 0 , totalHours = 0;
        // Get total hours
        for (i = 0; i< data.length ; i++) {
            totalHours += parseFloat(data[i].hours);
        }
        // Below d3.js is adopted from https://bl.ocks.org/mbostock/7555321
        var margin = {top: 20, right: 120, bottom: 100, left: 40},
            width = 750 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, .3);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(8, "%");

        var svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.hours/totalHours; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll(".tick text")
            .call(wrap, x.rangeBand());
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("width", x.rangeBand())
            .attr("fill", function(d) {return d.color;})
            .attr("y", function(d) { return y(d.hours/totalHours); })
            .attr("height", function(d) { return height - y(d.hours/totalHours); });

        function wrap(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }
        function type(d) {
            d.value = +d.value;
            return d;
        }

    });
}

function updatePieChart(filterDate){
    var eventsBoxRef = firebase.database().ref('eventsBox').child(userName);

    eventsBoxRef.on('value', function(snapshot) {
        var data = [];
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            // Get all events on filterDate
            if (childData.date == filterDate) {
                data.push(childData);
            }
        });
        var mapTypeHour = new Map();
        var colors=[];
        for (var event of data){
            // console.log(event.name);
            // If type has not yet recorded in mapTypeHour
            if (!mapTypeHour.has(event.type)){
                mapTypeHour.set(event.type, parseFloat(event.hours));
                colors.push(event.color);
            }
            else {
                var currentHours =  mapTypeHour.get(event.type);
                mapTypeHour.set(event.type, parseFloat(event.hours) + currentHours);
            }
        }
        // create dataTable to feed to google chart API
        var dataTable = [];
        for ( let [key,val] of mapTypeHour.entries()){
            dataTable.push([key,val]);
        }
        // Load the Visualization API and the corechart package.
        google.charts.load('current', {'packages':['corechart']});

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart);

        // Callback that creates and populates a data table,
        // instantiates the pie chart, passes in the data and
        // draws it.
        function drawChart() {

            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Type');
            data.addColumn('number', 'Hours');
            data.addRows(dataTable);
            // Set chart options
            var options = {
                backgroundColor: 'transparent',
                'title': 'Hover Me',
                titleTextStyle : {color: 'navy', fontName: "Comic Sans MS", fontSize: 15},
                'width':700,
                'height':500,
                'colors': colors,
                legend : 'right'};

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('pieChart'));
            chart.draw(data, options);
        }
        });
}

// Event, EventList, EventForm, EventBox Components
var Event = React.createClass({
    render: function() {
        return (
            <div className='event'>
                <li className="list-group-item">{this.props.event.name}
                    <span className="badge"><a className="remove-badge" data-toggle="tooltip" data-placement="right" title="Remove" onClick={this.props.delEvent.bind(null, this.props.event['.key'])}>&#x2716;</a></span>
                    <span className="badge">{this.props.event.hours}</span><span className="badge">{this.props.event.type}</span>
                </li>
            </div>
        );
    }
});

var EventList = React.createClass({
    render: function() {
        var totalEventsHoursToday = 0;
        var removeEvent= this.props.removeEvent;
        var filterDate = this.props.filterDate;
        var eventNodes = this.props.data.filter(function(value){
            if (value.date == filterDate) {
                totalEventsHoursToday += parseFloat(value.hours);
                return true;
            }
            else
                return false;
        }).map(function (event, index) {
            return <Event index={index} event={event} delEvent={removeEvent}></Event>;
        });
        return (
            <div className='eventList'>
                <ul className="list-group">{eventNodes}</ul>
                <h4>Total Hours: {totalEventsHoursToday} </h4>
            </div>

        );

    }
});

var EventForm = React.createClass({
    getInitialState: function() {
        return {
            eventType: 'Exercise',
            eventColor: 'STEELBLUE'
        };
    },

    handleChange:function(e){
        var type = this.refs.type.value;
        var color;
        if (type === "Exercise"){ color = "STEELBLUE";}
        else if (type === "ExploreWorld"){ color = "GREEN";}
        else if (type === "Family"){ color = "DEEPPINK";}
        else if (type === "Friend"){ color = "GOLD";}
        else if (type === "Hobby"){ color = "LIGHTSALMON";}
        else if (type === "Love"){ color = "RED";}
        else if (type === "Relax"){ color = "LIGHTSKYBLUE";}
        else if (type === "Recharge"){ color = "MIDNIGHTBLUE";}
        else if (type === "Socialize") { color = "DARKBLUE";}
        else if (type === "Study") { color = "ORANGE";}
        else if (type === "Work") { color = "SLATEGRAY";}
        this.setState({eventType: type, eventColor: color});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.refs.name.value.trim();
        var hours = this.refs.hours.value;
        this.props.onEventSubmit({name: name, hours: hours, type: this.state.eventType, color: this.state.eventColor});
        this.refs.name.value = '';
        this.refs.hours.value = '';
    },

    render: function() {
        return (
            <form className='eventForm' onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <h2>Add a new Activity</h2>
                    <label>Name:</label>
                    <input type='text' className="form-control" placeholder='Work on Essay#1, Run and Yoga,  Watch Spirited Away with my sister, etc.' ref='name' required/>
                    <label>Duration (in hours):</label>
                    <input type="number" className="form-control" ref="hours" min="0.25" max="10" step="any" placeholder='E.g. 0.25 hours (= 15 minutes)' required />
                    <label>Type</label>
                        <select className="form-control" ref='type' value={this.state.eventType} onChange={this.handleChange}>
                            <option value="Exercise">Exercise</option>
                            <option value="ExploreWorld">Explore World Around Me</option>
                            <option value="Family">Spend Time with Family</option>
                            <option value="Friend">Spend time with Friend</option>
                            <option value="Hobby">Hobby</option>
                            <option value="Love">Spend time with Loved One</option>
                            <option value="Recharge">Recharge</option>
                            <option value="Relax">Just Relax</option>
                            <option value="Socialize">Get out there and socialize</option>
                            <option value="Study">Study</option>
                            <option value="Work">Work</option>
                        </select>
                    <br/>
                    <input type='submit' className="btn btn-info btn-sm" value='Save this Event' />
                </div>
            </form>
        );
    }
});
var EventBox = React.createClass({
    mixins: [ReactFireMixin],

    handleEventSubmit: function(event) {
        // Here we push the update out to Firebase and let ReactFire update this.state.data

        var pickedDate = this.state.filterDate;
        firebase.auth().currentUser.getToken().then(function(idToken) {
            $.ajax({
                type: "POST",
                url: "/event",
                data: {name: event.name, hours: event.hours, date: pickedDate, type: event.type, color: event.color, token: idToken},
            });
        });
    },

    getInitialState: function() {
        return {
            data: [],
            filterDate: getToday()[0],
        };
    },

    componentWillMount: function() {
        // Here we bind the component to Firebase and it handles all data updates,
        // no need to poll as in the React example.
        // console.log("Looking for userName: " + userName);
        this.bindAsArray(firebase.database().ref('eventsBox').child(userName), 'data');
        console.log(firebase.database().ref('eventsBox').child(userName).once("value",function(val){
        }));

    },
    componentDidMount :function(){
        updateTimeChart(getToday()[0]);
        updatePieChart(getToday()[0]);
        $('#inlineDatepicker').datepick({onSelect: this.showDate});
    },
    showDate: function(date) {
    // alert('The date chosen is ' + date);
    var pickedDate = $('#inlineDatepicker').datepick('getDate')[0];
    var dd = pickedDate.getDate();
    var mm = pickedDate.getMonth()+1; //January is 0!
    var yyyy = pickedDate.getFullYear();
    var month = months[mm-1]
    var day = days[ pickedDate.getDay() ];
    if(dd<10) { dd='0'+dd; }
    if(mm<10) { mm='0'+mm; }

    var todayToStoreInFB = mm+'-'+dd+'-'+ yyyy;
    // console.log(todayToStoreInFB);
    var todayToShow = day + ', ' + month + ' ' + dd +', ' +yyyy;
    $('#printDate').text(todayToShow);
        $('#pickedDate').text(todayToShow);
        $('#pickedDateForChart').text(todayToShow);

    this.setState({filterDate: todayToStoreInFB});
    // Update time chart
    updateTimeChart(todayToStoreInFB);
    updatePieChart(todayToStoreInFB);
},
    removeEvent: function (key) {
        firebase.auth().currentUser.getToken().then(function(idToken) {
            // console.log("token" + idToken);
            $.ajax({
                url: "/event",
                type: 'DELETE',
                data: {key: key, token: idToken}
            });
        });
    },
    shareThis: function(){
        FB.ui(
            {
                method: 'share',
                quote: "Share this event",
                href: "http://mason.gmu.edu/~tnguy138/MyTimeMaster"
            },
            // callback
            function(response) {
                if (response && !response.error_message) {
                    alert('Posting completed.');
                } else {
                    alert('Error while posting.');
                    exit();
                }
            }
        );


    },

    render: function() {
        return (
            <div className="eventBox">
                <div className="col-sm-12">
                    <h1>Hi {displayName}, Let's make your
                        <span id="hi"> c</span>
                        <span id="hi1">o</span>
                        <span id="hi2">l</span>
                        <span id="hi3">o</span>
                        <span id="hi4">r</span>
                        <span id="hi5">f</span>
                        <span id="hi6">u</span>
                        <span id="hi7">l</span> day together </h1>
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-3" id="calendar">
                        <h2>Pick a Date</h2>
                        <div id="inlineDatepicker"></div>
                        <h4><small>Current date:</small> <br/><span id="printDate">{getToday()[1]}</span></h4>
                    </div>
                    <div className="col-sm-7" id="eventInput">
                        <EventForm onEventSubmit={this.handleEventSubmit} />
                    </div>
                    <div className="col-sm-1"></div>
                </div>

                <br/><br/><br/>

                <div className="col-sm-12">
                    {/*<div className="col-sm-1"></div>*/}
                    <div className="col-sm-3" id="eventList">
                        <h2>All Activities</h2>
                        <EventList data={this.state.data} removeEvent={this.removeEvent} filterDate={this.state.filterDate}/>
                        <button onClick={this.shareThis}>Share</button><br/>
                    </div>

                    <div className="col-sm-5" id="eventChart">
                        <h2>Time Chart</h2>
                        <svg className="chart"></svg>

                    </div>
                    <div className="col-sm-4">
                        <h2>Overall</h2>
                        <div id="pieChart"></div>

                    </div>
                    {/*<div className="col-sm-1"></div>*/}
                </div>

            </div>
        );
    }
});
