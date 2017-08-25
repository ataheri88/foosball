import React, { Component } from 'react';

import { Button } from 'reactstrap';

class Game extends Component {

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