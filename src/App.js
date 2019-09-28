import React, {Component} from 'react';

import{ BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import AdminPage from "./pages/admin";
import LightBoardPage from "./pages/board";
import SpecialistPage from "./pages/spec";
import CountVisitTime from "./pages/user";

class App extends Component {
    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path={"/"} component={AdminPage} />
                    <Route exact path={"/light-board"} component={LightBoardPage} />
                    <Route exact path={"/spec"} component={SpecialistPage} />
                    <Route exact path={"/user"} component={CountVisitTime} />
                </Switch>
            </Router>
        )
    }
}

export default App;