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
      results: []
    };
  }

  postQuery = async (query) => {
    await axios.post('https://v6ywaik4w1.execute-api.us-east-2.amazonaws.com/phase1/similar', query)
      .then(res => {
        const results = res.data.results;
        if (results !== this.state.results) {
          this.setState({ results });
        }
      })
  }

  validate() {
    const { post, valid } = this.state;

    valid.title = post.title.length > 0;
    valid.room = post.room.length > 0;
    valid.building = post.building !== "-- Select building --";
    valid.images = post.images.length > 0;
    valid.desc = post.desc.length < 251;
    valid.feeds = post.feeds !== "" && post.feeds > 0;

    const validForm = valid.title && valid.room && valid.building &&
      valid.images && valid.desc && valid.feeds;
    this.setState({ validForm });
  }

  renderResults() {
    return this.state.results.map(result =>
      <tr>
        <td>{result.term}</td>
        <td>{result.similarity}</td>
      </tr>
    )
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
            />
            <Results
              results={this.state.results}
            />
          </Container>
        </Container>
      </div>
    );
  }
}
