import React, {Component} from 'react';
import '../app-style.css';
import PropTypes from 'prop-types';
import * as moment from "moment";
import SideBarNav from "../SideBarNav";

let peopleArr =  JSON.parse(localStorage.getItem('listCopy')) !== null ?  JSON.parse(localStorage.getItem('listCopy')) : [];
let peopleDoneArr = JSON.parse(localStorage.getItem('listDone')) !== null ?  JSON.parse(localStorage.getItem('listDone')) : [];
let peopleNotDoneArr = JSON.parse(localStorage.getItem('listNotDone')) !== null ?  JSON.parse(localStorage.getItem('listNotDone')) : [];

function CalcTimeOnDone (array,array2){
    let tempArr2 = [];
    let tempArr = [];
    if(array2.length >= 0) {
        array2.forEach(function(item){
            window.SpecDirectory.specTypes.forEach(function(spec){
                if (spec.key === item.spec.toLowerCase() && item.bool === true) {
                    tempArr2.push({
                        index: item.index,
                        qNumber: item.qNumber,
                        name: item.name,
                        spec: item.spec,
                        surname: item.surname,
                        bool: item.bool,
                        timeAdded: item.timeAdded,
                        timeDone: moment().format("HH:mm"),
                        timeLast: moment.utc(moment(moment().format("HH:mm"), "HH:mm").diff(moment(item.timeAdded, "HH:mm"))).format("HH:mm")
                    })
                    tempArr.push({
                        spec: spec.display,
                        time: moment.utc(moment(moment().format("HH:mm"), "HH:mm").diff(moment(item.timeAdded, "HH:mm"))).format("HH:mm"),
                        instances: 1,
                        avgTime: 0
                    })
                }

            })
        })
    }

    localStorage.setItem('listDone',JSON.stringify(tempArr2));
    let tempArr3 = array.filter((el, i, tempArr2) => i === tempArr2.indexOf(el));


    tempArr.forEach(function(item){
        item.time = moment(item.time, "HH:mm").diff(moment().startOf("day"), "seconds");
    })

    const result = [...tempArr.reduce((r, o) => {
        const key = o.spec;

        const item = r.get(key) || Object.assign({}, o, {
            time: 0,
            instances: 0
        });
        item.time += o.time;
        item.instances += o.instances;

        return r.set(key, item);
    }, new Map()).values()];


    result.forEach(function(item) {
        item.avgTime = moment.utc(moment.duration((item.time / item.instances), "seconds").asMilliseconds()).format("HH:mm")
    })
    let tempTime = "00:00";
    peopleArr = tempArr3.concat(tempArr2);
    let tempArr4 = [];
    for(let i=0; i<peopleArr.length; i++) {
        result.forEach(function(o){
            if (o.spec === peopleArr[i].spec) {
                if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool === false && peopleArr[i-1].bool === false){
                    let temptemp = moment(o.avgTime, "HH:mm").diff(moment().startOf("day"), "seconds");
                    tempTime = moment.utc(moment.duration(temptemp*2, "seconds").asMilliseconds()).format("HH:mm")

                }else if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool === true){
                    tempTime = o.avgTime;
                }else if(i>0 && peopleArr[i].spec !== peopleArr[i-1].spec){
                    tempTime = o.avgTime;
                }
                else {
                    tempTime = o.avgTime;
                }
            }
        })
        /*for(let i=0; i<peopleArr.length; i++) {
        result.forEach(function(o){
            if (o.spec === peopleArr[i].spec) {
                if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool === false && peopleArr[i-1].bool === false){
                    let temptemp = moment(o.avgTime, "HH:mm").diff(moment().startOf("day"), "seconds");
                    tempTime = moment.utc(moment.duration(temptemp*2, "seconds").asMilliseconds()).format("HH:mm")

                }else if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool === true){
                    tempTime = o.avgTime;
                }else if(i>0 && peopleArr[i].spec !== peopleArr[i-1].spec){
                    tempTime=o.avgTime;
                }
            }
        })*/
        tempArr4.push({
            index: peopleArr[i].index,
            qNumber: peopleArr[i].qNumber,
            name: peopleArr[i].name,
            spec: peopleArr[i].spec,
            surname: peopleArr[i].surname,
            bool: peopleArr[i].bool,
            timeAdded: peopleArr[i].timeAdded,
            timeDone: peopleArr[i].timeDone,
            timeLast: peopleArr[i].timeLast,
            avgTime: tempTime
        })
    }
    peopleArr = tempArr4;
    peopleDoneArr = tempArr2;
    tempArr3 =  tempArr4.filter(word => word.bool === false);
    peopleNotDoneArr = tempArr3;
    localStorage.setItem('listCopy',JSON.stringify(tempArr4));
    localStorage.setItem('listNotDone',JSON.stringify(tempArr3));
}
/*function ChangeClass(){
    if(window.location.pathname === specPath){
        document.getElementById("spec-path").className = "spec-active"
    }else if(window.location.pathname === adminPath) {
        document.getElementById("admin-path").className = "admin-active"
    }
}*/
function Filter(props) {
    function updateSpec(evt) {
        props.updateFromState({ currentSpec: evt.target.value });
    }
    return (
        <div>
            <div className="group">
                <span className="glyphicon glyphicon-filter"></span>
                <select
                    name="spec_title"
                    id="spec-title"
                    value={props.currentSpec}
                    onChange={updateSpec}>
                    <option value="">
                        Filtras
                    </option>
                    {window.SpecDirectory.specTypes.map(function(item) {
                        return (
                            <option value={item.display} key={item.key}>
                                {item.display}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
}

function PatientRow (props){
        return (
            <>
                <th scope={"row"}>{props.counter}</th>
                <td>{props.name}</td>
                <td>{props.surname}</td>
                <td>{props.qNumber}</td>
                {/*<td><button className="row-delete"
                            onClick={this.props.deleteItem}>Aptarnauta
                </button></td>*/}
                <td><button className="glyphicon glyphicon-ok" id="served-btn" onClick={props.handleDoneCheck}></button>
                </td>
                </>
        );
}
class SpecPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfPeople: [],
            error: null,
            currentSpec: "",
            isServiced: false
        }
        this.updateFromState = this.updateFromState.bind(this);

        if(peopleNotDoneArr.length <= 1){
            this.count = 1;
        }
        else {
            this.count = peopleNotDoneArr[peopleNotDoneArr.length-1].index;
        }
    }

    buildList =(data)=>{
        this.setState({listOfPeople: data})
    }
    componentDidMount() {

        let data = localStorage.getItem('listNotDone');
        if (data) {
                this.setState({
                    listOfPeople: JSON.parse(data)
                });
        }
    }
/*
    deleteItem = indexToDelete => {
        this.setState(({ listOfPeople }) => ({
            listOfPeople: newArr = listOfPeople.filter((people, index) => index !== indexToDelete)
        }));


    };*/

/*
    updateLocalStorage(arr){
        const data = localStorage.getItem('listCopy');

        arr.map((item) => {
            peopleNotDoneArr.push(item);
        })
        peopleNotDoneArr = peopleNotDoneArr.filter((el, i, peopleNotDoneArr) => i === peopleNotDoneArr.indexOf(el));
        if(data){
            localStorage.setItem('listCopy', JSON.stringify(peopleNotDoneArr));
        }
//deletion from json here

    }*/
    handleDoneCheck (index) {
        let tempArr = [],
            tempArr2 = [];
        const data = localStorage.getItem('listCopy');

        this.state.listOfPeople.forEach(function(item){
            if (item.index === index) {
                item.bool = true;
                peopleDoneArr.push(item);
            } else {
                tempArr.push(item);
            }
        })
        tempArr2 = peopleDoneArr.concat(tempArr)

        if(data) {
            localStorage.setItem('listNotDone',JSON.stringify(tempArr))
            localStorage.setItem('listDone',JSON.stringify(peopleDoneArr))
        }
        CalcTimeOnDone(tempArr,tempArr2);
        this.setState({
            listOfPeople: tempArr
        })
    }

    updateFromState(spec) {
        this.setState(spec, this.updatePeopleList);
    }
    updatePeopleList() {
        var filteredPeople;
        const data = localStorage.getItem('listNotDone');
        if(!data) {
            filteredPeople = peopleNotDoneArr.filter(
                function (person) {
                    return (
                        (   this.state.currentSpec === "" ||
                            person.spec === this.state.currentSpec)
                    );
                }.bind(this)
            );
        }else {
            filteredPeople = JSON.parse(data).filter(
                function (person) {
                    return (
                        (this.state.currentSpec === "" ||
                            person.spec === this.state.currentSpec)
                    );
                }.bind(this)
            );
        }
        this.setState({
            listOfPeople: filteredPeople
        });
    }
    render(){

        let o=1;
        return (
            <div id={"viewport"}>
                <div id="sidebar">
                    <SideBarNav />
                </div>
                <div id="content">
                    <div>
                        <nav className="navbar navbar-default">
                            <div className="container-fluid-spec">
                                <ul className="nav navbar-nav navbar-right">
                                    <Filter listOfPeople={this.state.listOfPeople} currentSpec={this.state.currentSpec} updateFromState={this.updateFromState} />
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div>
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>Nr.</th>
                                <th>Vardas</th>
                                <th>Pavardė</th>
                                <th>Eilės numeris</th>
                                <th>Aptarnauti</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.listOfPeople.length > 0 &&
                            this.state.listOfPeople.map((item,key) => (
                                <tr key={key}>
                                <PatientRow updateFromState={this.updateFromState} index={item.index} counter={o++} name={item.name} surname={item.surname} qNumber={item.qNumber} isServiced={item.isServiced} handleDoneCheck={this.handleDoneCheck.bind(this,item.index)} updatePatient={this.updatePatient}/>
                                </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        {this.state.error &&
                        <h3>{this.state.error}</h3>
                        }

                    </div>
                </div>
            </div>
        )
    }
}
export default SpecPage;

Filter.propTypes = {
  currentSpec: PropTypes.string,
  updateFromState: PropTypes.func
}

PatientRow.propTypes = {
  counter: PropTypes.number,
  handleDoneCheck: PropTypes.func,
  name: PropTypes.string,
  qNumber: PropTypes.number,
  surname: PropTypes.string
}