import React from 'react';
import Container from "react-bootstrap/Container";
import Loader from 'react-loader-spinner'
import Table from "react-bootstrap/Table";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

export default class Results extends React.Component {
  renderTerms() {
    return this.props.results.map((result, index) =>
      <tr key={result.term}>
        <td>{index + 1}</td>
        <td>{result.term}</td>
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
    else if (this.props.results === null) {
      return;
    }
    else if (this.props.results.length > 0) {
      return (
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
      );
    }
    else {
      return (
        <Container className="results-msg" fluid>
          "{this.props.term}" not in model vocabulary.
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
