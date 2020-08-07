import React from 'react';
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

export default class Results extends React.Component {
  renderResults() {
    return this.props.results.map(result =>
      <tr>
        <td>{result.term}</td>
        <td>{result.similarity}</td>
      </tr>
    )
  }

  renderTable() {
    if (this.props.results.length > 0) {
      return (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Term</th>
              <th>Similarity</th>
            </tr>
          </thead>
          <tbody>
            {this.renderResults()}
          </tbody>
        </Table>
      );
    }
  }

  render() {
    return (
      <Container id="results-container" fluid>
        {this.renderTable()}
      </Container>
    );
  }
}
