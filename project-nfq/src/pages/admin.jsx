import React, {Component,  useState} from 'react';
import '../app-style.css';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import $ from 'jquery';
import moment from "moment";


let peopleArr =  JSON.parse(localStorage.getItem('listCopy')) !== null ?  JSON.parse(localStorage.getItem('listCopy')) : [];
export let peopleDoneArr = JSON.parse(localStorage.getItem('listDone')) !== null ?  JSON.parse(localStorage.getItem('listDone')) : [];
export let peopleNotDoneArr = JSON.parse(localStorage.getItem('listDone')) !== null ?  JSON.parse(localStorage.getItem('listDone')) : [];
let tempDate =new Date();
//console.log(tempDate.getTime());
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
                        <th>#</th>
                        <th>Vardas</th>
                        <th>Pavardė</th>
                        <th>Eilės numeris</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.listOfPeople.length > 0 &&
                    props.listOfPeople.map((item, key) => (
                        <tr>
                            <th key={item.key} id={item.id} scope={"row"}>{o++}</th>
                            <td key={item.key} id={item.id}>{item.name}</td>
                            <td key={item.key} id={item.id}>{item.surname}</td>
                            <td key={item.key} id={item.id}>{item.qNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }
}
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

class AddNew extends Component{
    constructor(props){
        super(props);

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

        if(peopleArr.length <= 1){
            this.count = 1;
        }
        else {
            this.count = peopleArr[peopleArr.length-1].index;
        }
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
             bool: false,
             timeAdded: moment().format('LTS')

     };
         peopleArr.push(newPatient);
         peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));
         console.log(peopleArr);
         localStorage.setItem("listCopy", JSON.stringify(peopleArr));
         this.props.addNewPatient(newPatient);
       //  this.postModal();
     }
     postModal(evt){
         evt.preventDefault();
         document.getElementById("hide-this").style.display= 'none';
         document.getElementById("add-new").innerText = "Užregistruota sėkmingai";
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

                <Modal animation={false} onClose={this.showModal} show={this.state.show} autoFocus={false}>
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
                                    <Form.Control placeholder="Pavardė"/>
                                </Form.Group>
                                <Form.Group onChange={this.handleTypeChange} as={Col} controlId="formGridState">
                                    <Form.Label>Specialistas</Form.Label>
                                    <Form.Control as="select">
                                        <option>Pasirinkti...</option>
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

function SaveList(props) {

    function saveToLocalStorage(evt) {
        evt.preventDefault();
        props.listOfPeople.map((item) => {
            if(item.bool === false) {
                peopleNotDoneArr.push(item);
            }else {
                peopleDoneArr.push(item);
            }
            peopleArr.push(item);

        })
        peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));
        peopleNotDoneArr = peopleNotDoneArr.filter((el, i, peopleNotDoneArr) => i === peopleNotDoneArr.indexOf(el));
        peopleDoneArr = peopleDoneArr.filter((el, i, peopleArr) => i === peopleDoneArr.indexOf(el));

        peopleArr.sort((a, b) => (a.spec > b.spec) ? 1 : (a.spec === b.spec) ? ((a.qNumber > b.qNumber) ? 1 : -1) : -1 )
        peopleNotDoneArr.sort((a, b) => (a.spec > b.spec) ? 1 : (a.spec === b.spec) ? ((a.qNumber > b.qNumber) ? 1 : -1) : -1 )
        console.log(peopleArr);
        console.log(peopleArr.length);
        localStorage.setItem("listCopy", JSON.stringify(peopleArr));
        localStorage.setItem("listNotDone", JSON.stringify(peopleNotDoneArr));
        localStorage.setItem("listDone", JSON.stringify(peopleDoneArr));
    }

    return <button onClick={saveToLocalStorage} id="save">Išsaugoti sąrašą</button>;
}
class AdminPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfPeople: [],
            error: null
        }
        this.addNewPatient =this.addNewPatient.bind(this);
    }
/*

    buildList =(data)=>{
        console.log(data);
        this.setState({listOfPeople: data})
    }
*/
    componentDidMount() {
        console.log('did mount')
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
   // }
        //const data = localStorage.getItem('listCopy');
/*
        fetch(url)
            .then(response => response.json())
            .then(this.buildList)
            .catch(error => {
                this.setState({error});
            })*/

            /*this.setState({
                list: JSON.parse(data)
            })*/


}
    addNewPatient(status){
        var updatedPatientList =this.state.listOfPeople.slice(0);

        updatedPatientList.push(status);

        this.setState({
            listOfPeople:updatedPatientList
        });

    }
    render(){
        console.log('render');
        let o=0;
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
                                    <AddNew listOfPeople={this.state.listOfPeople} newName={this.newName} newSurname={this.newSurname} newType={this.newType} addNewPatient={this.addNewPatient}/>
                                    <SaveList listOfPeople={this.state.listOfPeople}/>
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div>
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