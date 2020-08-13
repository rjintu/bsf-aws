import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from 'react-loader-spinner'
import Table from "react-bootstrap/Table";
import { CSVLink } from "react-csv";

export default class Results extends React.Component {
  renderTerms() {
    return this.props.results.results.map((result, index) =>
      <tr key={result.term}>
        <td>{index + 1}</td>
        <td><a href={`https://www.google.com/search?q=${result.term.replace(/ /g, "+")}`} target="_blank" rel="noopener noreferrer">{result.term}</a></td>
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
          <Container fluid id="results-heading">
            <Row>
              <Col id="results-text">
                Results for "{this.props.results.query}"
              </Col>
              <Col id="download">
                <CSVLink
                  data={this.props.results.results}
                  filename="results"
                >
                  Download results
                </CSVLink>
              </Col>
            </Row>
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
          "{this.props.results.query}" or other terms not in model vocabulary. Please try another query.
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
