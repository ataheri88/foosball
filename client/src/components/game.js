import React, { Component } from 'react';
import { connect } from 'react-redux';  
import { Button } from 'reactstrap';

import clientTableInterface from '../utils/clientTableInterface';

import redGoal from '../soundEffects/AnaheimDucks2017GoalHorn.mp3';
import blueGoal from '../soundEffects/TorontoMapleLeafs2017GoalHorn.mp3';


class Game extends Component {
  constructor(props) {
    super(props);
    this.clock = null;
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
    this.audioPlayer.src = sound;
    this.audioPlayer.play();
    setTimeout(() => this.audioPlayer && this.audioPlayer.pause(), 10 * 1000);
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
        <span> { Math.trunc(timer / 60) } : { timer % 60 } </span>
        <Button onClick={() => fetch('/api/game/table')} > Glow </Button>
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