import React, { Component, Fragment } from 'react';
import axios from 'axios';
import _ from 'lodash'
import 'bootstrap/dist/css/bootstrap.css';
import * as d3 from "d3";

class Dashboard extends Component {

    state = {
        users: '',
        userData: {},
        isError: false
    };

    componentDidMount() {
        this.getUsers();
    }

    getHeaders = () => {
        let token = sessionStorage.getItem('token');
        let headers = { 'Authorization': token };
        return headers;
    }
    getUsers = async () => {
        // bad way, should pick token from cookie
        const headers = this.getHeaders();
        axios.get('/users/', { headers }).then(response => {
            this.setState({ users: response.data });
        }).catch((error) => {
            this.setState({ isError: true })
            console.log(error);
        });
    };

    getUserDetails = async (ev) => {
        const headers = this.getHeaders();
        axios.get('/user/', {
            params: {
                username: ev.target.value
            },
            headers
        }).then((response) => {
            this.setState({ userData: response.data });
        }).catch((error) => {
            this.setState({ isError: true })
            console.log(error);
        });
    }
    getUserOptions = () => {
        let users = this.state.users[0];
        return users.map(user => {
            return <option value={user.username} key={user._id}>{user.username}</option>
        })
    }

    renderd3 = () => {
        let data1 = this.state.userData.weight;
        console.log("insinde rende: ", data1)


        // var data = [{
        //     'Wed Jan 23 00:00:00 IST 2013': 33.2
        // }, {
        //     'Thu Jan 24 00:00:00 IST 2013': 64
        // }, {
        //     'Fri Jan 25 00:00:00 IST 2013': 79
        // }, {
        //     'Sat Jan 26 00:00:00 IST 2013': 32
        // }, {
        //     'Sun Jan 27 00:00:00 IST 2013': 66
        // }, {
        //     'Mon Jan 28 00:00:00 IST 2013': 98
        // }];
        let data = this.state.userData.weight.map(item => {
            let x = {};
            x[new Date(item.date)] = parseInt(item.weight)
            return x
        })

    }

    render() {
        const { userData, users } = this.state;
        return (
            <Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                    <a className="navbar-brand" href="/">User Data</a>
                </nav>
                <div className="container">
                    <div className="row">
                        {users &&
                            <select className="form-control" defaultValue="" onChange={this.getUserDetails}>
                                <option value=""> Select User </option>
                                {this.getUserOptions()}
                            </select>
                        }
                    </div>
                    {!_.isEmpty(userData) &&
                        (<div className="mt-5">
                            <div className="row">
                                <label htmlFor="username" className="col-sm-3 col-form-label">User Name</label>
                                <div className="col-sm-9 col-form-label">
                                    {userData.username}
                                </div>
                            </div>
                            <div className="row">
                                <label htmlFor="age" className="col-sm-3 col-form-label">Age</label>
                                <div className="col-sm-9 col-form-label">
                                    {userData.age}
                                </div>
                            </div>
                            <div className="row">
                                <label htmlFor="hobbies" className="col-sm-3 col-form-label">Hobbies</label>
                                <div className="col-sm-9 col-form-label">
                                    {userData.hobbies.join(",")}
                                </div>
                            </div>
                            {/* {Object.keys(userData).length && this.renderd3()} */}
                        </div>)
                    }
                </div>
            </Fragment >
        );
    }
}

export default Dashboard;


// http://bl.ocks.org/Jverma/887877fc5c2c2d99be10
