import { GOAL_RED, GOAL_BLUE } from './types';

export function redGoal() {
  return ({type: GOAL_RED});
}

export function blueGoal() {
  return ({type: GOAL_BLUE});
}