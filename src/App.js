import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import logo from './logo.svg';
import Main from './components/Main.js';
import Login from './components/Login.js';

import './App.css';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path='/' component={Main} />
            <Route path='/callback' component={Login} />
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
