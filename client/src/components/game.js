import React, { Component } from 'react';

import { Button } from 'reactstrap';

import clientTableInterface from '../utils/clientTableInterface';

class Game extends Component {

  componentDidMount() {
    clientTableInterface.connect(window.location.hostname);
  }

  componentWillUnmount() {
    clientTableInterface.close();
  }

  render() {
    return (
      <div>
        <h3> Playing!! </h3>        
        <Button onClick={ () => this.props.history.push('/')}> Stop </Button>
      </div>
    );
  }
}

export default Game;