import { GET_ALLNODE } from '../actions'
const initialState = [] //array

export default (state = initialState, action) => {

    switch (action.type) {
        case
            GET_ALLNODE: //what action
            return action.payload  //[..nodes from api]

        default:
            return state
    }
}