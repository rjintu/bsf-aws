import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import axios from "axios";

import "bootswatch/dist/litera/bootstrap.min.css";
import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: null,
      results: null
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

  render() {
    return (
      <div id="app">
        <Container>
          <Form onSubmit={this.handleSubmit}>
              <Form.Group as={Row}>
                <Form.Label column sm={2} className="col-form-label-lg">Query</Form.Label>
                <Col>
                  <Form.Control className="form-control-lg"
                    type="text" name="query"
                    placeholder="Flavor"
                    onChange={this.handleChange}
                  />
                </Col>
                <Col sm={2}>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Col>
              </Form.Group>
          </Form>
        </Container>
      </div>
    );
  }
}
