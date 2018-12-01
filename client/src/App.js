import React, { Component, Fragment } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import { BrowserRouter as Router, Route } from 'react-router-dom'

class App extends Component {
  state = {
    isLoggedIn: false
  }
  componentDidMount() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.setState({ isLoggedIn: true });
    }
  }
  render() {
    return (
      <Fragment>
        <Router>
          <div>
            <Route render={() => this.state.isLoggedIn ? <Dashboard /> : <Login />} />
          </div>
        </Router>
      </Fragment >
    );
  }
}

export default App;