import React, { Component } from 'react';
import { connect } from 'react-redux';  
import { Button } from 'reactstrap';

import clientTableInterface from '../utils/clientTableInterface';

class Game extends Component {
  constructor(props) {
    super(props);
    this.clock = null;
    this.state = {
      timer: 0
    };
  }

  componentDidMount() {
    clientTableInterface.connect(window.location.hostname);
    this.clock = setInterval(() => this.setState({timer: this.state.timer + 1}), 1000);
  }

  componentWillUnmount() {
    clientTableInterface.close();
    clearInterval(this.clock);
  }

  render() {
    const { game } = this.props;
    const { timer } = this.state;
    return (
      <div>
        <h3> Scoreboard </h3>        
        <div className='scoreboard' style={{}}>
          <span style={{color: 'red',  fontSize: '20rem' }}> {game.red} </span>
          <span style={{color: 'blue', fontSize: '20rem' }}> {game.blue} </span>
        </div>
        <Button onClick={ () => this.props.history.push('/')}> Stop </Button>
        <span> { Math.round(timer / 60) } : { timer % 60 } </span>
      </div>
    );
  }
}

function mapStateToProps(state) {  
  return {    
    game: state.game
  };
}

export default connect(mapStateToProps, {})(Game);