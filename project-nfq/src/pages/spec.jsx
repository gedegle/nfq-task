import React, {Component,  useState} from 'react';
import '../app-style.css';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import $ from 'jquery';

import {peopleDoneArr, peopleNotDoneArr} from "./admin";
let newArr = [];
function SideBarNav(props){
    return (
        <div>
            <header>
                <a href="#">My App</a>
            </header>
            <ul className="nav">
                <li>
                    <a href="/">
                        <i className="zmdi zmdi-view-dashboard"></i> Paieška
                    </a>
                </li>
                <li>
                    <a href="/light-board">
                        <i className="zmdi zmdi-link"></i> Švieslentė
                    </a>
                </li>
                <li>
                    <a href="/spec">
                        <i className="zmdi zmdi-widgets"></i> Specialisto puslapis
                    </a>
                </li>
            </ul>
        </div>
    );
}

function SaveList(props) {

    function saveToLocalStorage(evt) {
        evt.preventDefault();
        props.listOfPeople.map((item) => {
            peopleNotDoneArr.push(item);
        })
        peopleNotDoneArr = peopleNotDoneArr.filter((el, i, peopleNotDoneArr) => i === peopleNotDoneArr.indexOf(el));
        console.log(peopleNotDoneArr);
        console.log(peopleNotDoneArr.length);
        localStorage.setItem("listCopy", JSON.stringify(peopleNotDoneArr));
    }

    return <button onClick={saveToLocalStorage} id="save">Išsaugoti sąrašą</button>;
}

function Filter(props) {
    function updateSpec(evt) {
        props.updateFormState({ currentSpec: evt.target.value });
    }

    return (
        <div>
            <div className="group">
                <label htmlFor="person-title">Filtras</label>
                <select
                    name="spec_title"
                    id="spec-title"
                    value={props.currentSpec}
                    onChange={updateSpec}>
                    <option value="">- Pasirinkti -</option>
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
class AddNew extends Component{
    constructor(props){
        super(props);

        this.state = {
            show: false,
            name:"",
            surname: "",
            listOfPeople: peopleNotDoneArr
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
        var newPatient = {
            index: this.count+1,
            qNumber: Math.random(),
            name: this.state.name,
            spec: this.state.type,
            surname: this.state.surname,
            bool: false

        };
        peopleNotDoneArr.push(newPatient);
        peopleNotDoneArr = peopleNotDoneArr.filter((el, i, peopleNotDoneArr) => i === peopleNotDoneArr.indexOf(el));
        console.log(peopleNotDoneArr);
        localStorage.setItem("listCopy", JSON.stringify(peopleNotDoneArr));
        this.props.addNewPatient(newPatient);
    }

    render() {
        return (
            <div className="App">
                <button
                    className="toggle-button"
                    id="centered-toggle-button"
                    onClick={e => {
                        this.showModal(e);
                    }}
                >
                    {" "}
                    show Modal{" "}

                </button>

                <Modal animation={false} onClose={this.showModal} show={this.state.show}>
                    <Modal.Header >
                        <Modal.Title id="add-new">Pridėti pacientą</Modal.Title>
                        <Button variant="link" onClick={this.showModal}>X</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Row>
                                <Form.Group onChange={this.handleNameChange} as={Col} controlId="formGridState">
                                    <Form.Label>Vardas</Form.Label>
                                    <Form.Control placeholder="Vardas"/>
                                </Form.Group>
                                <Form.Group onChange={this.handleSurnameChange} as={Col} controlId="formGridState">
                                    <Form.Label>Pavardė</Form.Label>
                                    <Form.Control placeholder="Pavardė"/>
                                </Form.Group>
                                <Form.Group onChange={this.handleTypeChange} as={Col} controlId="formGridState">
                                    <Form.Label>Specialistas</Form.Label>
                                    <Form.Control as="select">
                                        <option>Pasirinkti...</option>
                                        <option>Odontologas</option>
                                        <option>Neurologas</option>
                                        <option>Šeimos gydytojas</option>
                                        <option>Kardiologas</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Button onClose={this.showModal} onClick={this.postPatient} variant="primary" type="submit">
                                Patvirtinti
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

function PatientRow (props){
        return (
            <tr>
                <th key={props.key} id={props.id} scope={"row"}>{props.counter}</th>
                <td key={props.key} id={props.id}>{props.name}</td>
                <td key={props.key} id={props.id}>{props.surname}</td>
                <td key={props.key} id={props.id}>{props.qNumber}</td>
                {/*<td><button className="row-delete"
                            onClick={this.props.deleteItem}>Aptarnauta
                </button></td>*/}
                <td><button onClick={props.handleDoneCheck}>Aptarnauta</button>
                </td>
            </tr>

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
        this.addNewPatient =this.addNewPatient.bind(this);
        this.updateFromState = this.updateFromState.bind(this);

        if(peopleNotDoneArr.length <= 1){
            this.count = 1;
        }
        else {
            this.count = peopleNotDoneArr[peopleNotDoneArr.length-1].index;
        }
    }

    buildList =(data)=>{
        console.log(data);
        this.setState({listOfPeople: data})
    }
    componentDidMount() {
        console.log('did mount')
        let url = './data.json';
        let tempArr = [];
        let data = localStorage.getItem('listCopy');
        if (!data) {
            $.get(url, (result) => {
                result.map((item)=>{
                    if(item.bool === false) tempArr.push(item);
                })
                this.setState({
                    listOfPeople: tempArr,
                });

            });
        } else {
            JSON.parse(data).map((item)=>{
                if(item.bool === false) tempArr.push(item);
            })
            this.setState({
                listOfPeople: tempArr
            });
        }
 //   }
/*
        fetch(url)
            .then(response => response.json())
            .then(this.buildList)
            .catch(error => {
                this.setState({error});
            })
*/
}
    addNewPatient(status){
        var updatedPatientList =this.state.listOfPeople.slice(0);

        updatedPatientList.push(status);

        this.setState({
            listOfPeople:updatedPatientList
        });

    }

    deleteItem = indexToDelete => {
        this.setState(({ listOfPeople }) => ({
            listOfPeople: newArr = listOfPeople.filter((people, index) => index !== indexToDelete)
        }));

console.log(this.state)
    };

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
        let tempArr = [];
        const data = localStorage.getItem('listCopy');

            this.state.listOfPeople.map((item) => {
                if (item.index === index) {
                    item.bool = true;
                    peopleDoneArr.push(item);
                }else {
                    tempArr.push(item);
                }


            })
        if(data) {
            localStorage.setItem('listCopy',JSON.stringify(tempArr))
            localStorage.setItem('listDone',JSON.stringify(peopleDoneArr))
        }
        this.setState({
            listOfPeople: tempArr
        })
    }

    updateFromState(spec) {
        this.setState(spec, this.updatePeopleList);
    }
    updatePeopleList() {

        var filteredPeople;
        const data = localStorage.getItem('listCopy');
        if(!data) {
            filteredPeople = peopleNotDoneArr.filter(
                function (person) {
                    return (
                        (
                            this.state.currentSpec === "" ||
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
        console.log('render');

        let o=1;
        return (
            <div id={"viewport"}>
                <div id="sidebar">
                    <SideBarNav />
                </div>
                <div id="content">
                    <div>
                        <nav className="navbar navbar-default">
                            <div className="container-fluid">
                                <ul className="nav navbar-nav navbar-right">
                                    <Filter listOfPeople={this.state.listOfPeople} currentSpec={this.state.currentSpec} updateFormState={this.updateFromState} />
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div>
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Vardas</th>
                                <th>Pavardė</th>
                                <th>Eilės numeris</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.listOfPeople.length > 0 &&
                            this.state.listOfPeople.map((item,key) => (
                                <PatientRow updateFormState={this.updateFromState} index={item.index} counter={o++} name={item.name} surname={item.surname} qNumber={item.qNumber} isServiced={item.isServiced} key={key} id={key} deleteItem={this.deleteItem.bind(this,key)} handleDoneCheck={this.handleDoneCheck.bind(this,item.index)}/>
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