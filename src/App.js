import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import SimilarForm from "./components/SimilarForm";
import Results from "./components/Results";

import axios from "axios";

import "bootswatch/dist/cosmo/bootstrap.min.css";
import "./App.css";

import logo from './logos/black-sheep_logo-lockup.png'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      term: "",
      results: null
    };
  }

  postQuery = async (query) => {
    await axios.post('https://v6ywaik4w1.execute-api.us-east-2.amazonaws.com/phase1/similar', query)
      .then(res => {
        const loading = false;
        const term = query.term;
        let results = res.data.results;
        if (results[0].term === "key-not-found") {
          results = [];
        }
        this.setState({ loading, term, results });
      })
  }

  setLoading = state => {
    const loading = state;
    this.setState({ loading });
  }

  render() {
    return (
      <div id="app">
        <Container>
          <Container id="header">
            <Image id="logo" className="logo" src={logo} />
            <Row>
              <Col sm={0} id="logo-container" className="text-center">
                <Image id="logo-mobile" className="logo" src={logo} />
              </Col>
              <Col sm={12} id="title" className="text-center">
                Paiper
              </Col>
            </Row>
          </Container>
          <Container id="description" className="text-center" fluid>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rutrum nec turpis ac bibendum. Proin venenatis, augue vel pharetra vulputate, sapien libero auctor felis, vel hendrerit odio ante non eros. Mauris at nunc rhoncus, congue enim sed, iaculis neque. Ut et vestibulum est. Mauris sit amet mi elit. Vivamus condimentum, metus sed rutrum pharetra, arcu risus tincidunt leo, nec consectetur ex tellus vel justo. Mauris sit amet nibh leo.
          </Container>
          <Container id="app-container" fluid>
            <SimilarForm
              postQuery={this.postQuery}
              setLoading={this.setLoading}
            />
            <Results
              loading={this.state.loading}
              results={this.state.results}
              term={this.state.term}
            />
          </Container>
        </Container>
      </div>
    );
  }
}
