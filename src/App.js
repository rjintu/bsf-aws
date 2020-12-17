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
          <Row>
            <Col sm={0} id="logo-container" className="text-center">
              <a href="http://www.blacksheepfoods.com">
                <Image id="logo-mobile" className="logo" src={logo} />
              </a>
            </Col>
            <Col sm={12} id="title" className="text-center">
              Shearlock
            </Col>
          </Row>
          <a href="http://www.blacksheepfoods.com">
            <Image id="logo" className="logo" src={logo} />
          </a>
        </Container>
        <Container id="description" fluid>
          <text>
          Welcome to the Black Sheep Foods Shearlock tool! 
          Shearlock uses machine learning to guide your research by generating intelligent suggestions. Based on your inputs, it will
          identify similar compounds based on their context. We developed Shearlock to help identify patterns that
          might be missed by humans. 
          
          <br /> <br />Shearlock is not meant to be a search engine and is instead should supplement other methods (Google, PubMed, etc).  
          You can use this tool to find a starting point for any experiments involving food science.

          <br /> <br /> To get started, enter a search term below and click submit! 
          </text>
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
        <Container fluid id="tutorial-container">

        </Container>
        <Container fluid id="links-container">

        </Container>
        <Container fluid id="bsf-container">
          
        </Container>
      </div>
    );
  }
}
