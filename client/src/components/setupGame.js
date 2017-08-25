import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

class SetupGame extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    return (
      <div>
        <h3> New Game! </h3>
        <Button onClick={() => this.props.history.push('/game')}> Start Game </Button>
      </div>
    );
  }
}

export default SetupGame;