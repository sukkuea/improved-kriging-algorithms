import { GET_ALL_PREDICT } from '../actions'
export default (state = [], action) => {
    switch (action.type) {
        case GET_ALL_PREDICT:
            /*
            action.payload = {
                data:[
    
                ]
            }
            */
            return action.payload.data
            break;

        default:
            return state
            break;
    }
}