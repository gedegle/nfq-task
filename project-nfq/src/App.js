import React, {Component,  useState } from 'react';
//import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import{ BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';

import AdminPage from "./pages/admin";
import LightBoardPage from "./pages/board";
import SpecialistPage from "./pages/spec";

class App extends Component {
    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path={"/"} component={AdminPage} />
                    <Route exact path={"/light-board"} component={LightBoardPage} />
                    <Route exact path={"/spec"} component={SpecialistPage} />
                </Switch>
            </Router>
        )
    }
}

export default App;