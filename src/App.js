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
      prevQuery: null,
      searches: [],
      results: {
        query: null,
        results: null,
        newQuery: true
      }
    };
  }

  getQuery = async (query, newQuery) => {
    await axios.post('https://v6ywaik4w1.execute-api.us-east-2.amazonaws.com/phase1/similar', query)
      .then(res => {
        const loading = false;
        const prevQuery = query;
        const results = res.data;
        results.newQuery = newQuery;

        const name = results.query;
        const searches = this.state.searches.filter(query => query.name !== name);
        if (newQuery && name !== null && results.results.length > 0) {
          const search = {
            query: Object.assign({}, query),
            name: name
          }
          if (searches.length === 10) {
            searches.pop();
          }
          searches.unshift(search);
        }

        this.setState({ loading, prevQuery, searches, results });
      })
  }

  getMoreQuery = () => {
    const query = this.state.prevQuery;
    query.topn += 1000;
    this.getQuery(query, false);
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
              Shearlock
            </Col>
          </Row>
        </Container>
        <Container id="description" fluid>
          Welcome to the Black Sheep Foods Shearlock tool! Shearlock is a tool that uses machine learning to guide your research by generating intelligent suggestions. The suggestions are based on insights our ML model gleaned by reading over 3 million relevant food science articles. These suggestions can help guide your research by identifying key terms to research as a starting point, finding similar compounds to act as substitutes or replacements for materials you are using in an experiment, or even finding relationships between words using our analogies tools. The tool is not meant to be a search engine but rather act as a prefilter to help you choose the right starting point for a new line of inquiry to be researched using your preferred existing methods (Google, PubMed, etc.). This tool is simple, easy to use, and built to identify patterns and ideas that a human might otherwise not see. Want to get started? Just enter a search term below and click submit to begin using it.
        </Container>
        <Container id="app-container" fluid>
          <Row>
            <Col sm={6} className="app-col">
              <SimilarForm
                searches={this.state.searches}
                getQuery={this.getQuery}
                setLoading={this.setLoading}
                setTerm={this.setTerm}
              />
            </Col>
            <Col sm={6} className="app-col">
              <Results
                loading={this.state.loading}
                results={this.state.results}
                term={this.state.term}
                getMoreQuery={this.getMoreQuery}
              />
            </Col>
          </Row>
        </Container>
        <Container fluid>
          Tutorial
        </Container>
        <Container fluid>
          Links
        </Container>
        <Container fluid>
          BSF
        </Container>
      </div>
    );
  }
}
