/*index.jsx*/
import React, {Component} from 'react';
import '../board-style.css';

class LightBoardPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfPeople: [],
            error: null
        }
    }

    componentDidMount(){
        let i=0;
        let tempArr = [];
        var data = localStorage.getItem('listNotDone');
        if(data) {
            JSON.parse(data).forEach(function(item){
                if (i < 10) {
                    tempArr.push(item);
                    i++;
                }
            })
            this.setState({
                listOfPeople: tempArr
            })
        }
    }
    findTime(spec){
        let time = "00:00"
        JSON.parse(localStorage.getItem('timeList')).forEach(function(item){
            if (spec === item.spec) {
                time = item.avgTime;
            }
        });
        return time;
    }
    render(){
        let o=1;
        return (
            <div className="container">
                <h2>Laukiantieji pas specialistą </h2>
                <ol className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1-1">#</div>
                        <div className="col col-2">Specialistas</div>
                        <div className="col col-3">Eilės numeris</div>
                        <div className="col col-4">Laukimo laikas</div>
                    </li>
                    {this.state.listOfPeople.length > 0 &&
                    this.state.listOfPeople.map((item, index) => (

                    <li id={"list-"+o} key={index} className="table-row">
                        <div className="col col-1" data-label="#">{o++}</div>
                        <div className="col col-2" data-label="Specialistas">{item.spec}</div>
                        <div className="col col-3" data-label="Eilės numeris">{item.qNumber}</div>
                        <div className="col col-4" data-label="Laukimo laikas">{item.avgTime}</div>
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