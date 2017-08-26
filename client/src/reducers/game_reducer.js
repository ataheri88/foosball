import { GOAL_RED, GOAL_BLUE, NEW_GAME } from '../actions/types';

const INITIAL_STATE = {red: 0, blue: 0};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case GOAL_RED: 
      return {...state, red: state.red + 1};
    case GOAL_BLUE: {
      return {...state, blue: state.blue + 1};
    }
    case NEW_GAME: {
      return {...state, blue: 0, red: 0};
    }
    default: {
        return state;
    }
  }
}