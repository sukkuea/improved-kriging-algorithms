import axios from 'axios'
export const GET_ALLNODE = 'GET_ALLNODE'
export const SET_ADDNODE_RESULT = 'SET_ADDNODE_RESULT'
export const GET_ALL_PREDICT = 'GET_ALL_PREDICT'
const BASE_URL = 'http://localhost:5000'

export const getAllNode = () => {
    return async dispatch => { //middleware reduct-thunk
        const response = await axios.get(`${BASE_URL}/`)
        return dispatch({
            type: GET_ALLNODE,
            payload: response.data //[....nodes]
        })

    }
}

export const addNode = (value) => {
    // know  latitude longtitude attitude for calculate best nugget sill range
    return async dispatch => {
        const response = await axios.post(`${BASE_URL}/node/create-with-attitude`, value)
        return dispatch({
            type: SET_ADDNODE_RESULT,
            payload: response.data /*{
             status: 'success',
              value: 30.00,
              error :0.3333,
            }*/
        })
    }
}

export const addvariogram = (value) => {
    return async dispatch => {
        const response = await axios.post(`${BASE_URL}/semivariogram/create`, value)
        return dispatch({
            type: GET_ALL_PREDICT,
            payload: response.data //[]
        })
    }
}