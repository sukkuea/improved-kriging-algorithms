import { combineReducers } from 'redux'
import nodesList from './nodeList'
import user from './user'
import nodeResult from './addNodeResult'
import Predict from './Predict'


const root = combineReducers({
    nodesList, //[]
    user,
    nodeResult,
    Predict
});
export default root;
//nodesList=[{id:'0',value:'1'}]
//varain = [{nugget:'1',sill:'2',ragne:'3'}]
// users //initialState = {name:'JOHN',surname:'DO'}