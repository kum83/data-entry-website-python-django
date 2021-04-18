
import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
  Form,
} from "react-bootstrap";
import { FormFeedback } from "reactstrap";
import { Link, Redirect } from 'react-router-dom';

import Card from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";
import { login, getUserInfo, getSportsId } from 'redux/actions/auth.jsx';
import {connect} from "react-redux";
import AuthHelper from 'helpers/authHelper.jsx';
import {validateEmail} from 'helpers/commonHelper.jsx';
import { saveToLocalStorage, loadFromLocalStorage } from 'redux/reducers/auth'
import axios from 'axios'

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardHidden: true,
      errors: {
        username: '',
        password: ''
      }
    };
  }

  // rapidapi_headers = { 
  //   'x-rapidapi-key': "b50ad1dda9msh31dcaef409c21c6p15cff7jsnc6410d291bd0",
  //   'x-rapidapi-host': "therundown-therundown-v1.p.rapidapi.com",
  //   'useQueryString': true,
  // };  
  
  componentDidMount() {
    setTimeout(
      function() {
        this.setState({ cardHidden: false });
      }.bind(this),
      700
    ); 
  }

  handleLogin = e => {
    e.preventDefault();

    let username = e.target.elements.username.value;
    let password = e.target.elements.password.value;
    let errors = this.state.errors;
    const queryString = require('query-string');
    let parsed = queryString.parse(this.props.location.search);

    if (username === '') {
      errors.username = 'Email is required';
      this.setState({errors});
      return;
    }
    if (password === '') {
      errors.password = 'Password is required';
      this.setState({errors});
      return;
    }


    this.props.login(username, password)
      .then(
        async(res) => {
          const token = loadFromLocalStorage("token");
          const headers = { 
            'Authorization': 'token ' + token,
          };

          await axios.get('/api/data_entry/api_cache/?query=sports', {'headers': headers})
          .then(res => {
            console.log("###########################")
            console.log(res.data)
            const sports_ids = JSON.parse(res.data[0].data)
            console.log(sports_ids)
            console.log(sports_ids.sports)
              saveToLocalStorage("sports_ids", sports_ids.sports)
          });

          await this.props.get_userinfo()
            .then(
              () => {
                console.log("######## get_userinfo() :: Success");
              }
            ).catch(
              err => {
                console.log("Get UserInfo Error");
              }

            );
        }
      ).catch(err => {
        console.log("Login Error:::");
        console.log(err.response);
      });

    
  };

  handleChangeInput = e => {
    let errors = this.state.errors;
    if (errors[e.target.name] !== '') {
      errors[e.target.name] = '';
      this.setState(errors); 
    }
  };

  
  render() {
    if (this.props.isAuthenticated) {
      if (this.props.isAdmin) {
        return (
          <Redirect to='/frontend/admin/dashboard'/>
        );
      } else {
        return (
          <Redirect to='/frontend/data_collector/dashboard'/>
        )
      }
    } else {
      let {errors} = this.state;
      return (
        <Container className="container_login">
          <Row>
            <Col md={{ span: 4, offset: 4 }} sm={{ span: 6, offset: 3 }}>
              <Form onSubmit={this.handleLogin}>
                <Card
                  hidden={this.state.cardHidden}
                  textCenter
                  title="Login"
                  content={
                    <div>
                      <FormGroup>
                        <FormLabel>User name</FormLabel>
                        <FormControl placeholder="Enter username" type="text" name="username"  onChange={this.handleChangeInput}/>
                        <FormFeedback className="text-danger">{errors.username}</FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Password</FormLabel>
                        <FormControl placeholder="Password" type="password" name="password" autoComplete="off"/>
                      </FormGroup>
                    </div>
                  }
                  legend={
                    <FormGroup>
                      <Button variant="primary" fill wd type="submit">
                        Login
                      </Button>
                      {/* <FormText className="text-dark">Don't you have an account? <Link to="/frontend/auth/register-page"> Register</Link></FormText> */}
                    </FormGroup>
                  }
                  ftTextCenter
                />
              </Form>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

const mapStateToProps = state => ({
  isAuthenticated: AuthHelper.isAuthenticated(),
  isAdmin: AuthHelper.isAdmin(),
});

const mapDispatchToProps = (dispatch) => ({
  login: (username, password) => dispatch(login(username, password)),
  get_userinfo: () => dispatch(getUserInfo()),
  // get_basic_data: () => dispatch(getBasicData()),
  get_sports_id: () => dispatch(getSportsId()),
});



export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
