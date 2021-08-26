import { SET_ADDNODE_RESULT } from '../actions'
export default (state = {}, action) => {
  switch (action.type) {
    case SET_ADDNODE_RESULT:
      return action.payload
      break;

    default:
      return state
      break;
  }
}