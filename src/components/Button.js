import React, { Component } from 'react'

class Button extends Component {
    componentWillMount() {
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }
    componentWillReceiveProps(nextProps) {
    }
    componentWillUpdate(a, b) {
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <div>
                <button onClick={() => this.props.handlealert(this.props.name)}>submit</button>
            </div>
        )
    }
}
export default Button