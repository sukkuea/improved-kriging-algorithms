import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addvariogram } from '../actions'
class Variogram extends Component {
    state = {
        nugget: '',
        sill: '',
        range: ''
    }
    onChangeText = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })

    }
    onSubmit = () => {
        this.props.handleSumitNode(this.state)
    }
    render() {
        return (
            <div>
                <table>
                    <tr>
                        <th>variodId</th>
                        <th>zpredict</th>
                        <th>estimation</th>
                        <th>predictError</th>
                    </tr>
                    {
                        this.props.predict.map(({ variodId, zpredict, estimation, predictError }) => {
                            return (
                                <tr>
                                    <td>{variodId}</td>
                                    <td>{zpredict}</td>
                                    <td>{estimation}</td>
                                    <td>{predictError}</td>
                                </tr>
                            )
                        })
                    }
                </table>
                <p>nugget</p>
                <input onChange={this.onChangeText} name="nugget" />
                <p>sill</p>
                <input onChange={this.onChangeText} name="sill" />
                <p>range</p>
                <input onChange={this.onChangeText} name="range" />
                <br></br>
                <button onClick={this.onSubmit} >ADD NODE</button>
            </div>
        )
    }
}
const mapDisPatchToProps = (dispatch) => {
    return {
        handleSumitNode: (value) => dispatch(addvariogram(value))
    }
}
const mapStoreToProps = (store) => {
    return {
        predict: store.Predict
    }
}
export default connect(mapStoreToProps, mapDisPatchToProps)(Variogram)