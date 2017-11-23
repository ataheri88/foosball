import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux'; 
import { newGame } from '../actions';

class Home extends Component {
  render() {
    return (
      <div className='homescreen'>
        <div className="scoreboardHeader"> Welcome! </div>
        <div style={{width: '100vw', textAlign: 'center', margin: 'auto' }}> <Button className="btn btn-success" style={{fontSize: '2em'}} onClick={() => this.props.newGame() && this.props.history.push('/game/new')}> New Game </Button> </div>
      </div>
    );
  }
}

export default connect(null, { newGame })(Home);
