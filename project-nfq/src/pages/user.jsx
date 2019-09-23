import React, {Component,  useState, useEffect } from 'react';
import * as moment from 'moment/moment';

let temp = 6000;
const endDate = moment().add(temp, 'seconds')
function FindTime(props){
    return (
        <form id="find-form">
            <div className="form-row">
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="inputCity">Eilės numeris</label>
                    <input onChange={props.handleNumberChange} type="text" className="form-control" id="inputNumber"></input>
                </div>
            </div>
            </div>
            <button type="submit" onClick={props.findPatientTime} className="btn btn-primary">Sign in</button>
        </form>
    )
}

function TimeCountDown(props){
    const [seconds, setSeconds] = useState(props.seconds);
    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (":") : "00:";
        var mDisplay = m > 0 ? m + (":") : "00:";
        var sDisplay = s > 0 ? s + ("") : "00";
        return hDisplay + mDisplay + sDisplay;
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds - 5);
        }, 5000);
        return () => clearInterval(interval);
    }, []);


    return (
            <p className="App-header">
                {secondsToHms(seconds)}
            </p>
    );
};
class UserBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfPeople: JSON.parse(localStorage.getItem('listNotDone')),
            error: null,
            number: 0,
            time: "",
            numberAhead: 0,
            timeAhead: "",
            showResult: false,
            hideForm: false
        }
        this.handleNumberChange = this.handleNumberChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.running !== prevState.running){
            switch(this.state.running) {
                case true:
                    this.handleStart();
            }
        }
    }

    handleNumberChange(evt) {
        this.setState({
            number: evt.target.value
        })
    }
    hideOnClick(){
       this.setState({
           hideForm: true
       })
    }

    findPatientTime(evt){
        evt.preventDefault();
        //this.hideOnClick(evt);
        this.hideOnClick();
        let tempList = this.state.listOfPeople;
        let number = parseInt(document.getElementById("inputNumber").value);

        for(let i=0; i<tempList.length; i++){
            if(tempList[i].qNumber === number) {
                if (i < tempList.length) {
                    if (tempList[i].spec.indexOf(tempList[i + 1].spec) >= 0) {
                        console.log(tempList[i].spec + " " + tempList[i + 1].spec)
                        this.setState({
                            number: tempList[i].qNumber,
                            time: tempList[i].avgTime,
                            numberAhead: tempList[i + 1].qNumber,
                            timeAhead: tempList[i + 1].avgTime
                        })
                    } else {
                        console.log(tempList[i].qNumber)
                        this.setState({
                            number: tempList[i].qNumber,
                            time: tempList[i].avgTime,
                            numberAhead: 0,
                            timeAhead: "00:00",

                        })
                    }
                }
            }
            }
        this.displayOnClick();
       // changeHTMLCountDown(this.state.time);
    };
    displayOnClick(){
        this.setState({
            showResult: true
        })
    }

    render() {
        console.log(this.state)
      //  console.log(moment().add(moment.utc(moment.duration(this.state.time, "seconds").asMilliseconds()).format("HH:mm"), 'seconds'))
        return (
            <div>
                { this.state.showResult ? <div id="show-number" className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Jūsų eilės numeris {this.state.number}</h1>
                        <div className="inline-show">
                            <TimeCountDown seconds={moment(this.state.time, "HH:mm").diff(moment().startOf("day"), "seconds")}/>
                            <p className="lead">Pavėlinti eilę </p>
                            <button type="submit" className="btn btn-primary">Pavėlinti</button>
                        </div>
                    </div>
                </div> : null }
                <FindTime hideOnClick={this.hideOnClick} handleNumberChange={this.handleNumberChange} findPatientTime={this.findPatientTime.bind(this)}/>
            </div>
        )
    }
}

export default UserBoard;