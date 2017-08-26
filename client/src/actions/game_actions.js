import { GOAL_RED, GOAL_BLUE, NEW_GAME } from './types';

export function redGoal() {
  return ({type: GOAL_RED});
}

export function blueGoal() {
  return ({type: GOAL_BLUE});
}

export function newGame() {
  return ({type: NEW_GAME});
}