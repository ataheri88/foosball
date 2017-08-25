import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


import Home from './components/home';
import SetupGame from './components/setupGame';
import Game from './components/game';


import 'bootstrap/dist/css/bootstrap.css';



const NotFound = () => <h1>404.. This page is not found!</h1>

const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch> 
        <Route exact path='/' component={Home} />                   
        <Route path='/new' component={SetupGame} />
        <Route path='/game' component={Game} />
        <Route path='*' component={NotFound} />
      </Switch>
    </Router>
  </Provider>
)

App.propTypes = {
  store: PropTypes.object.isRequired,  
}

export default App;