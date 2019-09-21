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
        this.compareBy = this.compareBy.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.changeCol = this.changeCol.bind(this);

    }

    componentDidMount(){
        console.log('did mount')
        this.setState({list: JSON.parse(localStorage.getItem('listCopy'))});
        console.log(localStorage.getItem('listCopy'))
    }
    // saveToState (){
    //
    //    this.setState({list: JSON.stringify(localStorage.getItem('listCopy'))});
    //    console.log(localStorage.getItem('listCopy'))
    //
    //
    // }

    changeCol(){
           let temp = document.getElementsByClassName('col col-1');
           for (let i = 0; i < 10; i++) {
               if (temp[i].innerHTML === "1") {

               }
           }

    }
    compareBy(key,key2) {
        return function (a, b) {
            if (a[key] < b[key] && a[key2] < b[key2]) return -1;
            if (a[key] > b[key] && a[key2] > b[key2]) return 1;
            return 0;
        };
    }

    sortBy(key,key2) {
        const { list, lastKey1, lastKey2 } = this.state;
        if(lastKey1 === key && lastKey2 === key2) return
        let arrayCopy = [...list];
        arrayCopy.sort(this.compareBy(key,key2));
        this.setState({list: arrayCopy, lastKey1: key, lasKey2: key2});

    }
//onClick={() => this.sortBy('spec')}

    render(){
        console.log('render');
        let o=1;
        return (
            <div className="container">
                <h2>Laukiantieji pas specialistą </h2>
                <ol className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1-1">#</div>
                        <div className="col col-2"onClick={() => this.sortBy('spec', 'qNumber')}>Specialistas</div>
                        <div className="col col-3" onClick={() => this.changeCol()}>Eilės numeris</div>
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