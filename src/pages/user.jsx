import React, {Component,  useState, useEffect } from 'react';
import * as moment from 'moment/moment';
import "../user-style.css";
import PropTypes from 'prop-types';

function FindTime(props){
    return (
        <div id="form-hide">
            <label id="label-hide" className="label-main">Patikrinti savo laiką</label>
        <form id="find-form">
            <label className="label-qNumber" htmlFor="inputQnumber">Eilės numeris</label>
            <input onKeyUp={props.handleNumberChange} type="text" className="input-form" id="inputNumber"></input>
            <button type="submit" onClick={props.findPatientTime} className="btn-submit-number">Patvirtinti</button>
        </form>
        </div>
    )
}
/*function DelayTime(props){
    function onClickChange(){
        document.getElementById("change").innerHTML = props.time;
    }
    return <button onClick={onClickChange} id="btn-later" type="submit" className="btn btn-primary">Pavėlinti</button>
}*/
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
            <p id="change" className="App-header">
                {secondsToHms(seconds)}
            </p>
    );
}
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
            change: false,
            found: false
        }
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleOnDelay = this.handleOnDelay.bind(this);
    }


    handleNumberChange(evt) {
        this.setState({
            number: evt.target.value
        })
    }
    findPatientTime(evt){
        evt.preventDefault();

        document.getElementById("label-hide").style.display = "none";
        let tempList = this.state.listOfPeople;
        let number = parseInt(document.getElementById("inputNumber").value);

        for(let i=0; i<tempList.length; i++){
            if(tempList[i].qNumber === number) {
                if (i < tempList.length) {
                    if (tempList[i].spec.indexOf(tempList[i + 1].spec) >= 0) {
                        this.setState({
                            number: tempList[i].qNumber,
                            time: tempList[i].avgTime,
                            numberAhead: tempList[i + 1].qNumber,
                            timeAhead: tempList[i + 1].avgTime,
                            found: false
                        })
                    } else {
                        this.setState({
                            number: tempList[i].qNumber,
                            time: tempList[i].avgTime,
                            numberAhead: 0,
                            timeAhead: "00:00",
                            found: true
                        })
                    }

                }
            }
            else{
                this.setState({
                    found:false
                })
            }
            }
        this.displayOnClick();
        if(this.state.number === 0){
            this.hideOnClick();
            this.handleNotFund();
        }
    }
    displayOnClick(){
        this.setState({
            showResult: true
        })
    }
    hideOnClick(){
        this.setState({
            showResult: false
        })
    }
    handleNotFund(){
        this.setState({
            found: true
        })
    }
    handleOnDelay(){
        this.setState({
            change: true
        })
    }
    render() {
        return (
            <div>
                { this.state.showResult ?
                    <div id="show-number" className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Jūsų eilės numeris {this.state.number}</h1>
                        <div className="inline-show">
                            <p className="lead2">Likęs laukti laikas </p>
                            {
                                this.state.change ?
                                    <TimeCountDown seconds={moment(this.state.timeAhead, "HH:mm").diff(moment().startOf("day"), "seconds")}/> :
                                    <TimeCountDown seconds={moment(this.state.time, "HH:mm").diff(moment().startOf("day"), "seconds")}/>
                            }
                            <button onClick={this.handleOnDelay} id="btn-later" type="submit" className="btn btn-primary">Pavėlinti</button>
                        </div>
                    </div>
                </div> :  this.state.found ? <div className="container">
                    <h1 className="display-4">Tokio eilės numerio nėra</h1>
                </div> : null}
                <FindTime handleNumberChange={this.handleNumberChange} findPatientTime={this.findPatientTime.bind(this)}/>

            </div>
        )
    }
}

export default UserBoard;

FindTime.propTypes = {
  findPatientTime: PropTypes.func,
  handleNumberChange: PropTypes.func
}

TimeCountDown.propTypes = {
  seconds: PropTypes.number
}