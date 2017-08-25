import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <h3> Welcome Home! </h3>
        <Button onClick={() => this.props.history.push('/new')}> Start new game </Button>
      </div>
    );
  }
}

export default Home;