import React, {Component,  useState} from 'react';
import '../app-style.css';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import $ from 'jquery';

let peopleArr = [];
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
        props.list.map((item) => {
            peopleArr.push(item);
        })
        peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));
        console.log(peopleArr);
        console.log(peopleArr.length);
        localStorage.setItem("listCopy", JSON.stringify(peopleArr));
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
            list: peopleArr
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
        peopleArr.push(newPatient);
        peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));
        console.log(peopleArr);
        localStorage.setItem("listCopy", JSON.stringify(peopleArr));
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
            list: [],
            error: null,
            currentSpec: "",
            isServiced: false
        }
        this.addNewPatient =this.addNewPatient.bind(this);
        this.updateFromState = this.updateFromState.bind(this);

        if(peopleArr.length <= 1){
            this.count = 1;
        }
        else {
            this.count = peopleArr[peopleArr.length-1].index;
        }
    }

    buildList =(data)=>{
        console.log(data);
        this.setState({list: data})
    }
    componentDidMount() {
        console.log('did mount')
        let url = './data.json';
        const data = localStorage.getItem('listCopy');
        if (!data) {
            $.get(url, (result) => {
                this.setState({
                    list: result,
                });

            });
        } else {
            this.setState({
                list: JSON.parse(data)
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
        var updatedPatientList =this.state.list.slice(0);

        updatedPatientList.push(status);

        this.setState({
            list:updatedPatientList
        });

    }

    deleteItem = indexToDelete => {
        this.setState(({ list }) => ({
            list: newArr = list.filter((people, index) => index !== indexToDelete)
        }));

console.log(this.state)
    };

/*
    updateLocalStorage(arr){
        const data = localStorage.getItem('listCopy');

        arr.map((item) => {
            peopleArr.push(item);
        })
        peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));
        if(data){
            localStorage.setItem('listCopy', JSON.stringify(peopleArr));
        }
//deletion from json here

    }*/
    handleDoneCheck (index) {
        let temp;
        let tempArr = [];
        const data = localStorage.getItem('listCopy');

            this.state.list.map((item) => {
                if (item.index === index) {
                    item.bool = true;
                    temp = item;

                }
                tempArr.push(item);

            })
        if(data) {
            localStorage.setItem('listCopy',JSON.stringify(tempArr))
        }
        this.setState({
            list: tempArr
        })
    }

    updateFromState(spec) {
        this.setState(spec, this.updatePeopleList);
    }
    updatePeopleList() {

        var filteredPeople;
        const data = localStorage.getItem('listCopy');
        if(!data) {
            filteredPeople = peopleArr.filter(
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
            list: filteredPeople
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
                                    <Filter list={this.state.list} currentSpec={this.state.currentSpec} updateFormState={this.updateFromState} />
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
                            {this.state.list.length > 0 &&
                            this.state.list.map((item,key) => (
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