import React, {Component} from 'react';
import '../app-style.css';
import { Button, Modal } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import $ from 'jquery';
import moment from "moment";
import PropTypes from 'prop-types';
import SideBarNav from "../SideBarNav";

//-------if saving to backend server -------
//import restApi from '';
//-----------------------------------------------

const randomInt = require('random-int');

export let peopleArr =  JSON.parse(localStorage.getItem('listCopy')) !== null ?  JSON.parse(localStorage.getItem('listCopy')) : [];
export let peopleDoneArr = JSON.parse(localStorage.getItem('listDone')) !== null ?  JSON.parse(localStorage.getItem('listDone')) : [];
export let peopleNotDoneArr = JSON.parse(localStorage.getItem('listNotDone')) !== null ?  JSON.parse(localStorage.getItem('listNotDone')) : [];
function FilterDoneNotDone(arr1, arr2,arr3){
    arr1.forEach(function(item){
        if(item.bool === true){
            arr2.push(item);
        }else {
            arr3.push(item);
        }
    })
}
function CalcTimeOnSave (){

    let tempArr = [];
    let tempArr2 = [];
    let temp = peopleArr;
    if(temp.length !== 0) {
        temp.forEach(function(item){
            window.SpecDirectory.specTypes.forEach(function(spec) {
                if (spec.key === item.spec.toLowerCase() && item.bool === true) {
                    tempArr.push({
                        spec: spec.display,
                        time: moment.utc(moment(item.timeDone, "HH:mm").diff(moment(item.timeAdded, "HH:mm"))).format("HH:mm"),
                        instances: 1,
                        avgTime: 0
                    })
                    tempArr2.push({
                        index: item.index,
                        qNumber: item.qNumber,
                        name: item.name,
                        spec: item.spec,
                        surname: item.surname,
                        bool: item.bool,
                        timeAdded: item.timeAdded,
                        timeDone: item.timeDone,
                        timeLast: moment.utc(moment(item.timeDone, "HH:mm").diff(moment(item.timeAdded, "HH:mm"))).format("HH:mm")
                    })
                }
            })
        })
    }
    localStorage.setItem('listDone',JSON.stringify(tempArr2));
    tempArr2.forEach(function(a){
        peopleArr.filter(item => item.name === a.name && item.surname === a.surname && item.qNumber === a.qNumber).forEach(function(o){
            o.timeLast = a.timeLast;
        })
    })

    tempArr2 = [];
    tempArr.forEach(function(item) {
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

    result.forEach(function(item){
        item.avgTime = moment.utc(moment.duration((item.time / item.instances), "seconds").asMilliseconds()).format("HH:mm")

    })

    for(let i=0; i<peopleArr.length; i++) {
        let tempTime;
        result.forEach(function(o){
            if (o.spec === peopleArr[i].spec) {
                if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool !== true && peopleArr[i-1].bool !== true){
                    let temptemp = moment(o.avgTime, "HH:mm").diff(moment().startOf("day"), "seconds");
                    tempTime = moment.utc(moment.duration(temptemp*2, "seconds").asMilliseconds()).format("HH:mm")

                }else if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool === true){
                    tempTime = o.avgTime;

                }else if(i>0 && peopleArr[i].spec !== peopleArr[i-1].spec){
                    tempTime = o.avgTime;
                }
                else{
                    tempTime = o.avgTime;
                }
            }
        })
        tempArr2.push({
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
    peopleArr = tempArr2;
    localStorage.setItem('listCopy',JSON.stringify(peopleArr));

}
function PatientRow(props) {
        let o = 1;
        if (props.listOfPeople.includes('<!DOCTYPE') || props.listOfPeople === null) {
            return (
                <p>Nepavyko nuskaityti lankytojų duomenų</p>
            )
        } else {
            return (<table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Nr.</th>
                        <th>Vardas</th>
                        <th>Pavardė</th>
                        <th>Eilės numeris</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.listOfPeople.length > 0 &&
                    props.listOfPeople.map((item, key) => (
                        <tr key={key}>
                            <th scope={"row"}>{o++}</th>
                            <td>{item.name}</td>
                            <td>{item.surname}</td>
                            <td>{item.qNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }
}

class AddNew extends Component{
    constructor(props){
        super(props);

        if(peopleArr.length>=1){
            this.count = Math.max.apply(Math, peopleArr.map(function(o) { return o.index; })) +1;
        }
        else {
            this.count = 1;
        }
        this.state = {
            show: false,
            name:"",
            surname: "",
            listOfPeople: peopleArr
        }
         this.handleNameChange = this.handleNameChange.bind(this);
         this.handleSurnameChange = this.handleSurnameChange.bind(this);
         this.handleTypeChange = this.handleTypeChange.bind(this);
         this.postPatient = this.postPatient.bind(this);

    }
    showModal = e => {

        this.setState({
            show: !this.state.show
        });
    };
     handleNameChange(evt){
         this.setState({
             name: evt.target.value
         })
     }
     handleSurnameChange(evt){
         this.setState({
             surname: evt.target.value
         })
     }
     handleTypeChange(evt) {
         this.setState({
             type: evt.target.value
         })
     }

     postPatient(evt){
         evt.preventDefault();
         let qNum=randomInt(1,500);
         while(this.state.listOfPeople.includes(qNum)){
             qNum=randomInt(1,500);
         }
         var newPatient = {
             avgTime: "00:00",
             index: this.count,
             qNumber: qNum,
             name: this.state.name,
             spec: this.state.type,
             surname: this.state.surname,
             bool: false,
             timeAdded: moment().format('LT')
     };
         peopleNotDoneArr = [];
         peopleDoneArr = [];
         peopleArr.push(newPatient);
         peopleArr.sort((a, b) => (a.spec > b.spec) ? 1 : (a.spec === b.spec) ? ((a.qNumber > b.qNumber) ? 1 : -1) : -1 )

         CalcTimeOnSave(this);

         FilterDoneNotDone(peopleArr,peopleDoneArr,peopleNotDoneArr);

         localStorage.setItem("listCopy", JSON.stringify(peopleArr));
         localStorage.setItem("listNotDone", JSON.stringify(peopleNotDoneArr));
         localStorage.setItem("listDone", JSON.stringify(peopleDoneArr));
         this.setState({
             listOfPeople: peopleArr
         })
         this.props.updatePeopleList();
         this.showModal();

     }
    render() {
        return (

            <div className="nav-top" >
                <div className="button-class">
                    <div className="move-btn">
                    <span className="glyphicon glyphicon-plus"></span>
                    <button
                        className="toggle-button"
                        id="centered-toggle-button"
                        onClick={e => {
                            this.showModal(e);
                        }}>
                        {" "}
                        Pridėti{" "}
                    </button>
                    </div>
                </div>
                <Modal onHide={this.showModal} animation={false} onClose={this.showModal} show={this.state.show} autoFocus={false}>
                    <Modal.Header >
                        <Modal.Title id="add-new">Pridėti pacientą</Modal.Title>
                        <Button variant="link" onClick={this.showModal}>X</Button>
                    </Modal.Header>
                    <Modal.Body id="hide-this">
                        <Form>
                            <Form.Row>
                                <Form.Group onChange={this.handleNameChange} as={Col} controlId="formGridState">
                                    <Form.Label>Vardas</Form.Label>
                                    <Form.Control autoFocus={true} placeholder="Vardas"/>
                                </Form.Group>
                                <Form.Group onChange={this.handleSurnameChange} as={Col} controlId="formGridState">
                                    <Form.Label>Pavardė</Form.Label>
                                    <Form.Control disabled={!this.state.name} placeholder="Pavardė"/>
                                </Form.Group>
                                <Form.Group onChange={this.handleTypeChange} as={Col} controlId="formGridState">
                                    <Form.Label>Specialistas</Form.Label>
                                    <Form.Control as="select" disabled={!(this.state.name && this.state.surname)}>
                                        <option defaultValue="Pasirinkti...">Pasirinkti...</option>
                                        {window.SpecDirectory.specTypes.map(function(item) {
                                            return (
                                                <option value={item.display} key={item.key}>
                                                    {item.display}
                                                </option>
                                            );
                                        })}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            {this.state.type === "Pasirinkti..." || !this.state.type ? <Button disabled onClose={this.showModal} onClick={this.postPatient} variant="primary" type="submit">
                                Patvirtinti
                            </Button> : <Button  onClose={this.showModal} onClick={this.postPatient} variant="primary" type="submit">
                                Patvirtinti
                            </Button>}
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

function SaveList(props) {

    function saveToLocalStorage(evt) {
        evt.preventDefault();
        peopleArr = props.listOfPeople;
        peopleArr.sort((a, b) => (a.spec > b.spec) ? 1 : (a.spec === b.spec) ? ((a.qNumber > b.qNumber) ? 1 : -1) : -1 )
        peopleNotDoneArr = [];
        peopleDoneArr = [];
        CalcTimeOnSave(props);
        peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));

        FilterDoneNotDone(peopleArr,peopleDoneArr,peopleNotDoneArr);
        localStorage.setItem("listCopy", JSON.stringify(peopleArr));
        localStorage.setItem("listNotDone", JSON.stringify(peopleNotDoneArr));
        localStorage.setItem("listDone", JSON.stringify(peopleDoneArr));
        props.updatePeopleList();
    }

    return (
        <span className="save-span">
            <span className="glyphicon glyphicon-save"></span>
            <button onClick={saveToLocalStorage} id="save">Išsaugoti sąrašą</button>
        </span>
    );
}
class AdminPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfPeople: [],
            error: null
        }
        this.addNewPatient =this.addNewPatient.bind(this);
        this.updatePeopleList =this.updatePeopleList.bind(this);
    }
    componentDidMount() {
        let url = './data.json';
        const data = localStorage.getItem('listCopy');
        if (!data) {
            $.get(url, (result) => {
                    this.setState({
                        listOfPeople: result,
                    });
            });
        } else {
            this.setState({
                listOfPeople: JSON.parse(data)
            });
        }
}/*
//-------if saving to backend server -------
    onSubmit = (e) => {
        e.preventDefault();

        const data = this.state.listCopy;
        restApi.post('/', data)
            .then(res => {
                // success
            })
            .catch(err => {
                this.setState({ errorMessage: err });
            });
    };*/
//----------------------------------------
    addNewPatient(status){
        var updatedPatientList =this.state.listOfPeople.slice(0);

        updatedPatientList.push(status);

        this.setState({
            listOfPeople:updatedPatientList
        });

    }

    updatePeopleList() {
        const data = localStorage.getItem('listCopy');

        this.setState({
            listOfPeople: JSON.parse(data)
        });
    }
    render(){
        return (
            <div id={"viewport"}>
                <div id="sidebar">
                   <SideBarNav />
                </div>
                <div id="content">
                    <div id="navbar-noscroll">
                        <nav className="navbar navbar-default">
                            <div className="container-fluid">
                                <ul className="nav navbar-nav navbar-right">
                                    <AddNew updatePeopleList={this.updatePeopleList} listOfPeople={this.state.listOfPeople} newName={this.newName} newSurname={this.newSurname} newType={this.newType} addNewPatient={this.addNewPatient}/>
                                    <SaveList updatePeopleList={this.updatePeopleList} listOfPeople={this.state.listOfPeople} updatePatient={this.updatePatient} />
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div id="scrollable-table">
                       <PatientRow listOfPeople={this.state.listOfPeople}/>
                        {this.state.error &&
                        <h3>{this.state.error}</h3>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default AdminPage;

PatientRow.propTypes = {
  listOfPeople: PropTypes.any
}

SaveList.propTypes = {
  listOfPeople: PropTypes.any,
  updatePeopleList: PropTypes.func
}

AddNew.propTypes = {
  updatePeopleList: PropTypes.func
}