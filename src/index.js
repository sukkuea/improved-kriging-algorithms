import React from 'react';
import ReactDOM from 'react-dom';
/* REDUX SET UP */

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Form from './pages/Form'
import Addnode from './pages/Addnode'
import ViewVariogram from './pages/ViewVariogram'
import NodeWithFourZone from './pages/NodeWithFourZone';
import NodeWithNineZone from './pages/NodeWithNineZone';
import NodeWithSixTeenZone from './pages/NodeWithSixTeenZone';
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
//
const store = createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

/* REDUX SET UP */

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path="/" exact component={Form} />
            <Route path="/separate" exact component={NodeWithFourZone} />
            <Route path="/nine-separate" exact component={NodeWithNineZone} />
            <Route path="/sixteen-separate" exact component={NodeWithSixTeenZone} />
        </Router>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
