import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button'
import Loader from 'react-loader-spinner'
import { CSVLink } from "react-csv";


export default class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      end: 100
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.results !== this.props.results) {
      if (this.props.results.newQuery) {
        this.setState({ end: 100 });
      }
    }
  }

  handleMore = event => {
    const end = this.state.end + 100;
    this.setState({ end });
    if (end == this.props.results.results.length - 500) {
      this.props.getMoreQuery();
    }
  }

  renderTerms() {
    const results = this.props.results.results.slice(0, this.state.end);
    return results.map((result, index) =>
      <tr key={result.term}>
        <td>{index + 1}</td>
        <td><a href={`https://www.google.com/search?q=${result.term.replace(/ /g, "+")}`} target="_blank" rel="noopener noreferrer">{result.term}</a></td>
        <td>{result.similarity.toFixed(5)}</td>
      </tr>
    )
  }

  renderMore() {
    if (this.state.end < this.props.results.results.length) {
      return (
        <Container fluid>
          <Button
            variant="delete"
            onClick={this.handleMore}
          >
            More results...
          </Button>
        </Container>
      );
    }
  }

  renderResults() {
    if (this.props.loading) {
      return (
        <Container className="results-msg" fluid>
          Retrieving terms...
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
              <Col sm={8} id="results-text">
                Results for "{this.props.results.query}"
              </Col>
              <Col id="download">
                <CSVLink
                  data={this.props.results.results.slice(0, this.state.end)}
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
          {this.renderMore()}
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
