import React from 'react';
import Container from "react-bootstrap/Container";
import Loader from 'react-loader-spinner'
import Table from "react-bootstrap/Table";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default class Results extends React.Component {
  renderTerms() {
    return this.props.results.results.map((result, index) =>
      <tr key={result.term}>
        <td>{index + 1}</td>
        <td><a href={`https://www.google.com/search?q=${result.term.replaceAll(" ", "+")}`} target="_blank">{result.term}</a></td>
        <td>{result.similarity}</td>
      </tr>
    )
  }

  renderResults() {
    if (this.props.loading) {
      return (
        <Container className="results-msg" fluid>
          Retreiving terms...
          <Loader type="ThreeDots" color="#53963e" height={20} width={50} />
        </Container>
      );
    }
    else if (this.props.results.results === null) {
      return;
    }
    else if (this.props.results.results.length > 0) {
      return (
        <>
          <Container fluid id="results-text">
            Results for "{this.props.results.term}"...
          </Container>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Term</th>
                <th>Similarity</th>
              </tr>
            </thead>
            <tbody>
              {this.renderTerms()}
            </tbody>
          </Table>
        </>
      );
    }
    else {
      return (
        <Container className="results-msg" fluid>
          "{this.props.results.term}" or other terms not in model vocabulary. Please try another query.
        </Container>
      );
    }
  }

  render() {
    return (
      <Container id="results-container" fluid>
        {this.renderResults()}
      </Container>
    );
  }
}
