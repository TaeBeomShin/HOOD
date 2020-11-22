import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Main from './components/Main.js';
import Callback from './components/Callback';
import './App.css';
import Init from './Init'
import { useDispatch, useSelector } from 'react-redux';



const App = () => {  
  Init();
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/callback' component={Callback} />
        </Switch>
      </Router>
    </div>
  );

}
export default App;
