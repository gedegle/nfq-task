/*index.jsx*/
import React, {Component,  useState } from 'react';
import '../board-style.css';
import Table from "react-bootstrap/Table";
//Functional Component

class LightBoardPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            list: [],
            error: null
        }
    }

    componentDidMount(){
        console.log('did mount')
        let i=0;
        let tempArr = [];
        var data = localStorage.getItem('listCopy');
        if(data) {
            JSON.parse(localStorage.getItem('listCopy')).map((item) => {
                if (i < 10 && item.bool === false) {

                    console.log(item);
                    tempArr.push(item);
                    i++;
                }
            })

            // this.setState({list: JSON.parse(localStorage.getItem('listCopy'))});
            this.setState({
                list: tempArr
            })
        }
        console.log(localStorage.getItem('listCopy'))
    }
    render(){
        console.log('render');
        let o=1;
        return (
            <div className="container">
                <h2>Laukiantieji pas specialistą </h2>
                <ol className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1-1">#</div>
                        <div className="col col-2">Specialistas</div>
                        <div className="col col-3">Eilės numeris</div>
                    </li>
                    {this.state.list.length > 0 &&
                    this.state.list.map((item, index) => (

                    <li id={"list-"+o} key={index} className="table-row">
                        <div className="col col-1" data-label="#">{o++}</div>
                        <div className="col col-2" data-label="Specialistas">{item.spec}</div>
                        <div className="col col-3" data-label="Eilės numeris">{item.qNumber}</div>
                    </li>
                        ))}
                </ol>

                {this.state.error &&
                <h3>{this.state.error}</h3>
                }

        </div>
        )
    }
}
export default LightBoardPage;