import React, {Component,  useState} from 'react';
import '../app-style.css';
import { Button, Modal } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import $ from 'jquery';
import moment from "moment";
const randomInt = require('random-int');

export let peopleArr =  JSON.parse(localStorage.getItem('listCopy')) !== null ?  JSON.parse(localStorage.getItem('listCopy')) : [];
export let peopleDoneArr = JSON.parse(localStorage.getItem('listDone')) !== null ?  JSON.parse(localStorage.getItem('listDone')) : [];
export let peopleNotDoneArr = JSON.parse(localStorage.getItem('listNotDone')) !== null ?  JSON.parse(localStorage.getItem('listNotDone')) : [];
function FilterDoneNotDone(arr1, arr2,arr3){
    arr1.map((item)=>{
        if(item.bool === true){
            arr2.push(item);
        }else {
            arr3.push(item);
        }
    })
}
function CalcTimeOnSave (props){

    let tempArr = [];
    let tempArr2 = [];
    let temp = peopleArr;
    if(temp.length !== 0) {
        temp.map((item) => {
            window.SpecDirectory.specTypes.map((spec) => {
                if (spec.key === item.spec.toLowerCase() && item.bool === true) {
                    let subtr = moment.utc(moment(item.timeDone, "HH:mm").diff(moment(item.timeAdded, "HH:mm"))).format("HH:mm")
                    tempArr.push({
                        spec: spec.display,
                        time: subtr,
                        instances: 1,
                        avgTime: 0
                    })
                    console.log(spec.display+" "+subtr);
                    tempArr2.push({
                        index: item.index,
                        qNumber: item.qNumber,
                        name: item.name,
                        spec: item.spec,
                        surname: item.surname,
                        bool: item.bool,
                        timeAdded: item.timeAdded,
                        timeDone: item.timeDone,
                        timeLast: subtr
                    })
                }
            })
        })
    }

    localStorage.setItem('listDone',JSON.stringify(tempArr2));
    tempArr2 = [];
    tempArr.map((item) => {
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
    }, new Map).values()];

    result.map((item) => {
        item.avgTime = moment.utc(moment.duration((item.time / item.instances), "seconds").asMilliseconds()).format("HH:mm")

    })

    for(let i=0; i<peopleArr.length; i++) {
        let tempTime;
        result.map((o => {
            if (o.spec === peopleArr[i].spec) {
                if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool !== true && peopleArr[i-1].bool !== true){
                    let temptemp = moment(o.avgTime, "HH:mm").diff(moment().startOf("day"), "seconds");
                    tempTime = moment.utc(moment.duration(temptemp*2, "seconds").asMilliseconds()).format("HH:mm")
                    console.log(peopleArr[i].spec + " "+tempTime)
                }else if(i>0 && peopleArr[i].spec === peopleArr[i-1].spec && peopleArr[i].bool === true){
                    tempTime = o.avgTime;
                    console.log("else if: "+peopleArr[i].spec+" "+tempTime);
                }else{
                    tempTime=o.avgTime;
                }
            }
        }))
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
    console.log(tempArr2);

    peopleArr = tempArr2;
    localStorage.setItem('listCopy',JSON.stringify(peopleArr));
    //localStorage.setItem('timeList',JSON.stringify(result));
    //props.updatePatient(peopleArr);

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
              <a href="/">My App</a>
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
              <li>
                  <a href="/user">
                      <i className="zmdi zmdi-widgets"></i> Lankytojo puslapis
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
         let qNum=randomInt(1,500);
         while(this.state.listOfPeople.includes(qNum)){
             qNum=randomInt(1,500);
         }
         var newPatient = {
             avgTime: "00:00",
             index: this.count+1,
             qNumber: qNum,
             name: this.state.name,
             spec: this.state.type,
             surname: this.state.surname,
             bool: false,
             timeAdded: moment().format('LT')
     };
         console.log(peopleNotDoneArr);
         peopleArr.push(newPatient);
         peopleArr.sort((a, b) => (a.spec > b.spec) ? 1 : (a.spec === b.spec) ? ((a.qNumber > b.qNumber) ? 1 : -1) : -1 )

         CalcTimeOnSave(this);

        // console.log(peopleNotDoneArr);
        // peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));
         //peopleNotDoneArr = peopleNotDoneArr.filter((el, i, peopleNotDoneArr) => i === peopleNotDoneArr.indexOf(el));
     //    console.log(peopleNotDoneArr);

      //   console.log(peopleNotDoneArr);
         FilterDoneNotDone(peopleArr,peopleDoneArr,peopleNotDoneArr);

         localStorage.setItem("listCopy", JSON.stringify(peopleArr));
         localStorage.setItem("listNotDone", JSON.stringify(peopleNotDoneArr));
         localStorage.setItem("listDone", JSON.stringify(peopleDoneArr));

     //    this.props.addNewPatient(newPatient);

     }
    render() {
        return (

            <div className="App">
                <button
                    className="toggle-button"
                    id="centered-toggle-button"
                    onClick={e => {
                        this.showModal(e);
                    }}>
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
        peopleArr = props.listOfPeople;
        peopleArr.sort((a, b) => (a.spec > b.spec) ? 1 : (a.spec === b.spec) ? ((a.qNumber > b.qNumber) ? 1 : -1) : -1 )

        CalcTimeOnSave(props);
        peopleArr = peopleArr.filter((el, i, peopleArr) => i === peopleArr.indexOf(el));

       // peopleArr.sort((a, b) => (a.spec > b.spec) ? 1 : (a.spec === b.spec) ? ((a.qNumber > b.qNumber) ? 1 : -1) : -1 )
        FilterDoneNotDone(peopleArr,peopleDoneArr,peopleNotDoneArr);
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
       // this.updatePatient =this.updatePatient.bind(this);
    }
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
}
/*    updatePatient(result) {
        this.setState({
            listOfTimes: result
        });
    }*/
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
                                    <SaveList listOfPeople={this.state.listOfPeople} updatePatient={this.updatePatient} />
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