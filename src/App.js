import React, { Component } from "react"; // ONLY COMPONENT
import { BrowserRouter as Router, Route } from "react-router-dom";
import Form from "./pages/Form";
// import Addnode from './pages/Addnode'
// import ViewVariogram from './pages/ViewVariogram'
// import logo from './logo.svg';
import "./App.css";
// import Button from './components/Button';
import { connect } from "react-redux";

class App extends Component {
  state = {
    name: "",
  };
  HandleChangeName = (e) => {
    const value = e.target.value;
    this.setState({
      name: value,
    });
  };
  Handlealert = (name) => {
    return alert(name);
  };
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Route path="/" exact component={Form} />
          </header>
        </div>
      </Router>
    );
  }
}
const mapStoreToProps = (store) => {
  /*
  state = {
    nodeList:[],
  }
   */
  return {
    nodesList: store.nodesList,
    user: store.user,
  };
};

export default connect(mapStoreToProps, null)(App);
//(store)=>  App(mapStateToProps(store))
