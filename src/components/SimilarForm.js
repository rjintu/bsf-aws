import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class SimilarForm extends React.Component {
  constructor(props) {
    super(props);

    this.query = {
      term: "",
      topn: "1"
    }

    this.valid = {
      term: false,
      topn: true
    };

    this.state = {
      query: this.query,
      valid: this.valid,
      validForm: false
    };
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    const query = this.state.query;
    query[name] = value;
    this.setState({ query });
    this.validate()
    console.log(this.state.query);
  }

  handleSubmit = event => {
    event.preventDefault();
    event.returnValue = false;

    const { query } = this.state;
    query.topn = parseInt(query.topn);
    this.props.postQuery(query);
  }

  validate() {
    const { query, valid } = this.state;

    valid.term = query.term.length > 0;
    valid.topn = query.topn !== "" && query.topn > 0;

    const validForm = valid.term && valid.topn;
    this.setState({ validForm });
  }

  cleanPost() {
    const post = Object.assign({}, this.initialPost)
    post.diet = Object.assign({}, this.initialDiet)
    return post;
  }

  render() {
    return (
      <Container id="form-container" fluid>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row}>
            <Form.Label column sm={2} className="col-form-label-lg">Term</Form.Label>
            <Col>
              <Form.Control className="form-control-lg"
                type="text" name="term"
                placeholder="flavor"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2} className="col-form-label-lg"># Terms</Form.Label>
            <Col>
              <Form.Control className="form-control-lg"
                type="number" name="topn"
                value={this.state.query.topn}
                onChange={this.handleChange}
              />
            </Col>
            <Col sm={2}>
              <Button className="btn-lg" type="submit" variant="primary"
                disabled={!this.state.validForm}>
                Submit
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
