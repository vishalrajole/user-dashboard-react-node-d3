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

    graphContainer = React.createRef();
    componentDidMount() {
        this.getUsers();
    }

    /***
    * helper method to abstract headers
    */
    getHeaders = () => {
        // BAD way, should pick token from cookie (should be httpOnly cookie)
        let token = sessionStorage.getItem('token');
        let headers = { 'Authorization': token };
        return headers;
    }
    /***
     * get list of users displayed in dropdown
     */
    getUsers = async () => {
        const headers = this.getHeaders();
        axios.get('/users/', { headers }).then(response => {
            this.setState({ users: response.data });
        }).catch((error) => {
            this.setState({ isError: true })
            console.log(error);
        });
    };

    /***
     * get details of selected user i.e age, hobbies, weights and feed it to d3 graph
     * */
    getUserDetails = async (ev) => {
        const headers = this.getHeaders();
        axios.get('/user/', {
            params: {
                username: ev.target.value
            },
            headers
        }).then((response) => {
            this.setState({ userData: response.data });
            this.createAreaChart();
        }).catch((error) => {
            this.setState({ isError: true })
            console.log(error);
        });
    }

    /***
     * dropdown options for username
     * */
    getUserOptions = () => {
        let users = this.state.users[0];
        return users.map(user => {
            return <option value={user.username} key={user._id}>{user.username}</option>
        })
    }
    /***
     * render d3 graph with weight details of selected user
    * */
    createAreaChart = () => {
        let data = this.state.userData.weight;
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.weight = +d.weight;
        });
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        var x = d3.time.scale()
            .range([0, width]);
        var y = d3.scale.linear()
            .range([height, 0]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var area = d3.svg.area()
            .x(function (d) { return x(d.date); })
            .y0(height)
            .y1(function (d) { return y(d.weight); });

        let myref = this.graphContainer;
        console.log(myref.current)
        var svg = d3.select(myref.current).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain(d3.extent(data, function (d) { return d.weight; }));
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Weight");
        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);
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
                            <div ref={this.graphContainer}></div>
                        </div>
                        )
                    }
                </div>
            </Fragment >
        );
    }
}

export default Dashboard;