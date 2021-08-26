import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addNode } from '../actions'
class Addnode extends Component {
    state = {
        attitude: '',
        longtitude: '',
        latitude: ''
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
                <p>Latitude</p>
                <input onChange={this.onChangeText} name="latitude" />
                <p>Longtitude</p>
                <input onChange={this.onChangeText} name="longtitude" />
                <p>Attitude</p>
                <input onChange={this.onChangeText} name="attitude" />
                <br></br>
                <button onClick={this.onSubmit} >ADD NODE</button>
            </div>
        )
    }
}
const mapDisPatchToProps = (dispatch) => {
    return {
        handleSumitNode: (value) => dispatch(addNode(value))
    }
}
export default connect(null, mapDisPatchToProps)(Addnode)