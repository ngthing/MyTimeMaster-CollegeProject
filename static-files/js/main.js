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
var eventsBoxRef = firebase.database().ref('eventsBox');
var data = [];
eventsBoxRef.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        console.log("print child");
        console.log(childData);
        data.push(childData);
    });
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

// Jasmine starts here
describe('EventBox', function () {
    var TestUtils = React.addons.TestUtils;
    var eventBoxComponent, element, renderedDOM;
    beforeEach(function (done) {
        element = React.createElement(EventBox);
        eventBoxComponent = TestUtils.renderIntoDocument(element);
        eventBoxComponent.setState({items: [{text: "testItem"}]}, done);
    });
    it("Has a Save button", function () {
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(eventBoxComponent, "input");
        expect(inputs[3]).not.toBeUndefined();
        expect(inputs[3].innerHTML).toBe("Save");
    });
    it("Has a EventList component", function () {
        expect(function () {
            TestUtils.findRenderedComponentWithType(eventBoxComponent, EventList);
        }).not.toThrow();
    });
    it("Has a EventForm component", function () {
        expect(function () {
            TestUtils.findRenderedComponentWithType(eventBoxComponent, EventForm);
        }).not.toThrow();
    });
    describe("Save event button", function () {
        beforeEach(function () {
            spyOn(eventBoxComponent.fireRef, "push");
        });
        it("Causes fireBase push to be called", function () {
            let inputSave = TestUtils.scryRenderedDOMComponentsWithTag(eventBoxComponent, "input")[3];
            TestUtils.Simulate.click(inputSave);
            expect(eventBoxComponent.fireRef.push).toHaveBeenCalledWith({});
        });
    });
    describe("EventList", function () {
        var eventListComponent;
        beforeEach(function(){
            eventListComponent = TestUtils.findRenderedComponentWithType(eventBoxComponent, EventList);
        });
        it("Updates firebase when text is changed", function(){
            var setSpy;
            setSpy = jasmine.createSpy("set");
            spyOn(eventBoxComponent.fireRef, "child").and.returnValue({set : setSpy});
            var inputs = TestUtils.scryRenderedDOMComponentsWithTag(eventBoxComponent,"input");
            inputs[0].value = "try";
            TestUtils.Simulate.change(inputs[0]);
            expect(eventBoxComponent.fireRef.child).toHaveBeenCalled();
            expect(setSpy).toHaveBeenCalledWith({text: "try"});
        });
     });

});
