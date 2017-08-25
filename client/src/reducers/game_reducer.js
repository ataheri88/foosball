import { GOAL_RED, GOAL_BLUE } from '../actions/types';

const INITIAL_STATE = {};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case GOAL_RED: 
      return {...state, red: state.blue + 1};
    case GOAL_BLUE: {
      return {...state, blue: state.blue + 1};
    }
   
    default: {
        return state;
    }
  }
}