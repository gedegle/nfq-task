import React, {Component,  useState } from 'react';
import * as moment from 'moment/moment';

let peopleDoneArr = JSON.parse(localStorage.getItem('listDone')) !== null ?  JSON.parse(localStorage.getItem('listDone')) : [];

let tempArr = [];
class CountVisitTime extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfPeople: JSON.parse(localStorage.getItem('listDone')),
            error: null
        }
        this.calcTimeLast = this.calcTimeLast.bind(this);
        this.calcTimeAverage = this.calcTimeAverage.bind(this);
    }
    calcTimeLast(){

        let tempArr2 = [];
        let temp = localStorage.getItem('listDone');
        JSON.parse(temp).map((item)=>{
            window.SpecDirectory.specTypes.map((spec)=>{
                if(spec.key === item.spec.toLowerCase()){
                    let subtr= moment.utc(moment(item.timeDone,"HH:mm").diff(moment(item.timeAdded,"HH:mm"))).format("HH:mm")
                    tempArr.push({
                        spec: spec.display,
                        time: subtr,
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
                        timeLast: subtr
                })
                }
            })
        })

    }
    calcTimeAverage(){
        tempArr.map((item)=>{
            item.time = moment(item.time,"HH:mm").diff(moment().startOf("day"),"seconds");
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

        console.log(result);
               result.map((item)=>{
                   item.avgTime = item.time/item.instances;
               })
        return result;

    }
    render(){
        this.calcTimeLast();
        this.calcTimeAverage().map((item)=>{
            console.log(item.avgTime)
        });
        return(
            <div>Hello World!</div>
        )
    }
}
export default CountVisitTime;