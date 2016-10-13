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
var converter = new Showdown.converter();

var Event = React.createClass({
    render: function() {
        // var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
            <div className='event'>
                <h4 className='name'>{this.props.name}. For: {this.props.hours} hours</h4>
                {/*<span dangerouslySetInnerHTML={{__html: rawMarkup}} />*/}
            </div>
        );
    }
});

var EventList = React.createClass({
    render: function() {
        var eventNodes = this.props.data.map(function (event, index) {
            return <Event key={index} name={event.name} hours={event.hours}></Event>;
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
                <input type='text' placeholder='Event name' ref='name' />
                <br/>Duration (in hours):
                <input type="number" ref="hours" min="0" max="10" step="any" />
                <br/><input type='submit' value='Save' />
            </form>
        );
    }
});
var EventBox = React.createClass({
    mixins: [ReactFireMixin],

    handleEventSubmit: function(event) {
        // Here we push the update out to Firebase and let ReactFire update this.state.data
        this.firebaseRefs['data'].push(event);
    },

    getInitialState: function() {
        return {
            data: []
        };
    },

    componentWillMount: function() {
        // Here we bind the component to Firebase and it handles all data updates,
        // no need to poll as in the React example.
        this.bindAsArray(firebase.database().ref('eventsBox'), 'data');
    },

    render: function() {
        return (
            <div className='eventBox'>
                <h1>Your events today</h1>
                <EventList data={this.state.data} />
                <EventForm onEventSubmit={this.handleEventSubmit} />
            </div>
        );
    }
});

ReactDOM.render(
    <EventBox />,
    document.getElementById('content')
);

// D3js for chart here
// Get a database reference to our posts
var ref = firebase.database().ref('eventsBox');;

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    console.log(data.length);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
var data = [{"name":"Study for CS306","hours": 4},{"name":"Learn React","hours": 5}, {"name":"HW5","hours": 2}];

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
    .attr("width", function(d){ return d.hours*60;})
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d,i) { return d.hours*60 - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.name + " for " + d.hours + "hrs";});