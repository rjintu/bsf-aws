import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import Loader from 'react-loader-spinner'
import { CSVLink } from "react-csv";


export default class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.results !== this.props.results) {
      if (this.props.results.newQuery) {
        this.setState({ page: 1 });
      }
    }
  }

  handleFirst = event => {
    this.setState({ page: 1 });
  }

  handlePrev = event => {
    const page = this.state.page - 1;
    this.setState({ page });
  }

  handleNext = event => {
    const page = this.state.page + 1;
    this.setState({ page });
    this.getMoreTerms(page);
  }

  handlePage = event => {
    const page = parseInt(event.target.name);
    this.setState({ page });
    this.getMoreTerms(page);
  }

  getMoreTerms(page) {
    const length = this.props.results.results.length;
    if (page % 10 === 7 && length === (page + 3) * 100) {
      this.props.getMoreQuery();
    }
  }

  renderTerms() {
    const page = this.state.page;
    const start = (page - 1) * 100;
    const end = page * 100
    const results = this.props.results.results.slice(start, end);
    return results.map((result, index) =>
      <tr key={result.term}>
        <td>{start + index + 1}</td>
        <td><a href={`https://www.google.com/search?q=${result.term.replace(/ /g, "+")}`} target="_blank" rel="noopener noreferrer">{result.term}</a></td>
        <td>{result.similarity.toFixed(5)}</td>
      </tr>
    )
  }

  renderMore() {
    if (this.state.end < this.props.results.results.length) {
      return (
        <Container className="pl-0 pr-0">
          <Button
            variant="link"
            onClick={this.handleMore}
          >
            More results...
          </Button>
        </Container>
      );
    }
  }

  renderPages() {
    const page = this.state.page;
    if (page === 1) {
      return (
        <>
          <Pagination.First disabled/>
          <Pagination.Prev disabled/>
          <Pagination.Item active className="page-num"
            name="1"
            onClick={this.handlePage}
          >
            1
          </Pagination.Item>
          <Pagination.Item className="page-num"
            name="2"
            onClick={this.handlePage}
          >
            2
          </Pagination.Item>
          <Pagination.Item className="page-num"
            name="3"
            onClick={this.handlePage}
          >
            3
          </Pagination.Item>
        </>
      );
    }
    else {
      return (
        <>
          <Pagination.First onClick={this.handleFirst}/>
          <Pagination.Prev onClick={this.handlePrev}/>
          <Pagination.Item className="page-num"
            name={page - 1}
            onClick={this.handlePage}
          >
            {page - 1}
          </Pagination.Item>
          <Pagination.Item active className="page-num"
            name={page}
            onClick={this.handlePage}
          >
            {page}
          </Pagination.Item>
          <Pagination.Item className="page-num"
            name={page + 1}
            onClick={this.handlePage}
          >
            {page + 1}
          </Pagination.Item>
        </>
      );
    }
  }

  renderResults() {
    if (this.props.loading) {
      return (
        <Container fluid className="results-msg">
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
                  data={this.props.results.results}
                  filename={`${this.props.results.query}.csv`}
                >
                  Download results
                </CSVLink>
              </Col>
            </Row>
          </Container>
          <Container id="results-table">
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
          </Container>
          <Pagination>
            {this.renderPages()}
            <Pagination.Next onClick={this.handleNext}/>
          </Pagination>
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
