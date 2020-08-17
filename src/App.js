import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import SimilarForm from "./components/SimilarForm";
import Results from "./components/Results";

import axios from "axios";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "bootswatch/dist/cosmo/bootstrap.min.css";
import "./App.css";

import logo from './logos/black-sheep_logo_website.png'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      results: {
        term: null,
        results: null
      }
    };
  }

  postQuery = async (query) => {
    await axios.post('https://v6ywaik4w1.execute-api.us-east-2.amazonaws.com/phase1/similar', query)
      .then(res => {
        const loading = false;
        const results = res.data;
        this.setState({ loading, results });
      })
  }

  setLoading = loading => {
    this.setState({ loading });
  }

  render() {
    return (
      <div id="app">
        <Container id="header" className="margin-0" fluid>
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
          Welcome to the Black Sheep Foods Paiper tool!
          This is based on a paper by Google researchers that demonstrated how we can mine previously published scientific papers for latent discoveries. The results you see below were trained on 3.5 million articles related to food science.
          This tool will return the most similar results to your query, based on vector distances.
          To get started, just type a word into the "term" box and choose the number of results you want. Click the submit button when you're ready.
          If you'd like to add some additional filters, you can click "add vector" and add another word with a positive or negative connotation.
          Example: suppose you wanted to find words similar to "cow", but close to "farm" and far from "wild". You can add a positive vector for "farm" and a negative vector for "wild".
        </Container>
        <Container id="app-container" fluid>
          <Row>
            <Col sm={6}>
              <SimilarForm
                postQuery={this.postQuery}
                setLoading={this.setLoading}
                setTerm={this.setTerm}
              />
            </Col>
            <Col sm={6}>
              <Results
                loading={this.state.loading}
                results={this.state.results}
                term={this.state.term}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
