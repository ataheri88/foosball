import React, { Component } from 'react';
import { connect } from 'react-redux';  
import { Button } from 'reactstrap';

import clientTableInterface from '../utils/clientTableInterface';

import redGoal from '../assets/sounds/AnaheimDucks2017GoalHorn.mp3';
import blueGoal from '../assets/sounds/TorontoMapleLeafs2017GoalHorn.mp3';

class Game extends Component {
  constructor(props) {
    super(props);
    this.clock = null;
    this.audioTimeout = null;
    this.audioPlayer = new Audio();
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
    this.audioTimeout && clearTimeout(this.audioTimeout);
    this.audioPlayer.pause();
    this.audioPlayer = null;
  }

  componentWillReceiveProps(nextProps) {
    const { game } = this.props;

    if (nextProps.game.blue !== game.blue) {
      this.playGoalSound(blueGoal);
    } else if (nextProps.game.red !== game.red) {
      this.playGoalSound(redGoal);
    }
  }
  	
  playGoalSound(sound) {
    this.audioTimeout && clearTimeout(this.audioTimeout);
    this.audioPlayer.src = sound;
    this.audioPlayer.play();
    this.audioTimeout = setTimeout(() => this.audioPlayer && this.audioPlayer.pause(), 15 * 1000);
  }

  render() {
    const { game } = this.props;
    const { timer } = this.state;
    return (
      <div className='scoreboard' style={{}}>
        <div className='scoreboardHeader'> Red vs Blue </div>        
        <div className='scoreValues'>
          <div className="scoreValue" style={{color: 'rgb(117,39,41)'}}> {game.red} </div>
          <div className="scoreClock"> { Math.trunc(timer / 60).toString().padStart(2,"0") }:{ (timer % 60).toString().padStart(2,"0") } </div>
          <div className="scoreValue" style={{color: 'rgb(25,25,156)'}}> {game.blue} </div>
        </div>
        <Button className="gameExit btn btn-danger" onClick={ () => this.props.history.push('/')}> X </Button>        
        { /* <Button  onClick={() => fetch('/api/game/table')} > Glow </Button> */ }
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