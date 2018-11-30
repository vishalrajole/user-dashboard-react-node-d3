import React, { Component } from 'react';
import axios from 'axios';
import Dashboard from './../dashboard/dashboard'
class Login extends Component {
    state = {
        username: '',
        password: '',
        isLoggedIn: false,
        isLoginError: false,
        errorMessage: ''
    }
    onLogin = (event) => {
        const { username, password } = this.state;
        event.preventDefault();
        axios.post('/login', { username: username, password: password }).then(response => {
            console.log("login", response.data);
            sessionStorage.setItem('token', response.data.token);
            this.setState({ isLoggedIn: true });
        }).catch((error) => {
            this.setState({ isLoginError: true, errorMessage: error.response.data || 'Something went wrong!', isLoggedIn: false })
            console.log(error);
        });
    }
    onChange(e) {
        if (this.props.onChange) {
            this.props.onChange(e.target, e.target.value, e);
        };
    }
    onEmailChange = (e) => {
        this.setState({ username: e.target.value })
    }
    onPasswordChange = (e) => {
        this.setState({ password: e.target.value })
    }
    render() {
        let { isLoggedIn, isLoginError, errorMessage } = this.state;
        return (
            <React.Fragment>
                {!isLoggedIn && <div className="container">
                    <h3 className="text-center">User Dashboard</h3>
                    <div className="card mt-5">
                        <div className="card-body">
                            <form className="row">
                                <div className="form-group col-12">
                                    <label>Email</label>
                                    <input type="email" onChange={this.onEmailChange} className="form-control" placeholder='Username' />
                                </div>
                                <div className="form-group col-12">
                                    <label>Password</label>
                                    <input type="password" onChange={this.onPasswordChange} className="form-control" placeholder='Password' />
                                </div>
                                <div className="form-group col-12">
                                    <button type="submit" onClick={this.onLogin} className="btn btn-primary btn-block">Login</button>
                                </div>
                            </form>
                            {isLoginError && <div className="text-danger">{errorMessage}</div>}

                        </div>

                    </div>

                </div>
                }
                {isLoggedIn && <Dashboard></Dashboard>}
            </React.Fragment>
        )
    }
}

export default Login;