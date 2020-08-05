import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import axios from "axios";

import "bootswatch/dist/cosmo/bootstrap.min.css";
import "./App.css";

import logo from './logos/black-sheep_logo-lockup.png'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: null,
      results: [
        {
          "term": "cow",
          "similarity": 0.9823234
        },
        {
          "term": "pig",
          "similarity": 0.9379564
        },
        {
          "term": "chicken",
          "similarity": 0.9283848
        }
      ]
    };
  }

  handleChange = event => {
    const query = event.target.value;
    this.setState({ query });
    console.log(this.state);
  }

  handleSubmit = async () => {
    await axios.get('asdf', { query: this.state.query })
      .then(async res => {
        const results = res.data;
        if (results !== this.state.results) {
          await this.setState({ results });
          console.log(this.state);
        }
      })
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
          <Image id="logo" src={logo} />
          <Container id="header" className="text-center" fluid>
            Paiper
          </Container>
          <Container id="description" className="text-center" fluid>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rutrum nec turpis ac bibendum. Proin venenatis, augue vel pharetra vulputate, sapien libero auctor felis, vel hendrerit odio ante non eros. Mauris at nunc rhoncus, congue enim sed, iaculis neque. Ut et vestibulum est. Mauris sit amet mi elit. Vivamus condimentum, metus sed rutrum pharetra, arcu risus tincidunt leo, nec consectetur ex tellus vel justo. Mauris sit amet nibh leo.
          </Container>
          <Container id="app-container" fluid>
            <Container id="form-container" fluid>
              <Form onSubmit={this.handleSubmit}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={2} className="col-form-label-lg">Query</Form.Label>
                    <Col>
                      <Form.Control className="form-control-lg"
                        type="text" name="query"
                        placeholder="flavor"
                        onChange={this.handleChange}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={2} className="col-form-label-lg"># Terms</Form.Label>
                    <Col>
                      <Form.Control className="form-control-lg"
                        type="text" name="query"
                        value="1"
                        onChange={this.handleChange}
                      />
                    </Col>
                    <Col sm={2}>
                      <Button className="btn-lg" type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                  </Form.Group>
              </Form>
            </Container>
            <Container id="results-container" fluid>
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
            </Container>
          </Container>
        </Container>
      </div>
    );
  }
}
