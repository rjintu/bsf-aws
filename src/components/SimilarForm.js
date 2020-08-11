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
      topn: "10",
      vectors: []
    }

    this.vector = {
      key: "0",
      term: "",
      positive: true,
      scalar: "1"
    }

    this.state = {
      query: this.query,
      vectorCount: 0,
      valid: false
    };
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    const query = this.state.query;
    query[name] = value;
    this.setState({ query });
    this.validate();
  }

  handleAddVector = event => {
    const query = this.state.query;
    const vector = Object.assign({}, this.vector);
    let vectorCount = this.state.vectorCount;

    vector.key = vectorCount.toString();
    query.vectors.push(vector);
    vectorCount = vectorCount + 1;

    this.setState({ query, vectorCount });
    this.validate();
  }

  handleDeleteVector = event => {
    const name = event.target.name;
    const query = this.state.query;

    const dash = name.indexOf("-");
    const key = name.substr(0, dash);
    query.vectors = query.vectors.filter(vector => vector.key !== key);

    this.setState({ query });
    this.validate();
  }

  handleVectorChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    const query = this.state.query;

    const dash = name.indexOf("-");
    const key = name.substr(0, dash);
    const field = name.substr(dash + 1);

    for (let i = 0; i < query.vectors.length; i++) {
      if (query.vectors[i].key === key) {
        if (field === "pos" || field === "neg") {
          query.vectors[i].positive = field === "pos";
        }
        else {
          query.vectors[i][field] = value;
        }
      }
    }

    this.setState({ query });
    this.validate();
  }

  handleSubmit = event => {
    event.preventDefault();
    event.returnValue = false;
    this.props.setLoading(true);

    const query = this.state.query;
    query.topn = parseInt(query.topn);

    for (let i = 0; i < query.vectors.length; i++) {
      query.vectors[i].scalar = parseInt(query.vectors[i].scalar);
    }

    this.props.postQuery(query);
  }

  validate() {
    const query = this.state.query;
    const term = query.term.length > 0;
    const topn = query.topn !== "" && query.topn > 0;
    let valid = term && topn;

    for (let i = 0; i < query.vectors.length; i++) {
      valid = valid && query.vectors[i].term.length > 0;
    }

    this.setState({ valid });
  }

  renderExtraVectors() {
    return this.state.query.vectors.map((vector) =>
      <Form.Group as={Row} key={vector.key}>
        <Form.Label column sm={2} className="col-form-label-lg label">Term</Form.Label>
        <Col>
          <Form.Control className="form-control-lg"
            type="text"
            name={`${vector.key}-term`}
            placeholder="e.g. flavor"
            onChange={this.handleVectorChange}
          />
        </Col>
        <Col sm={2} className="radio-col">
          <Form.Check
            type="radio"
            label="Positive"
            name={`${vector.key}-pos`}
            checked={vector.positive}
            onChange={this.handleVectorChange}
          />
          <Form.Check
            type="radio"
            label="Negative"
            name={`${vector.key}-neg`}
            checked={!vector.positive}
            onChange={this.handleVectorChange}
          />
        </Col>
        <Form.Label column sm={1} className="col-form-label-lg label">Scalar</Form.Label>
        <Col sm={2}>
          <Form.Control className="form-control-lg"
            type="number"
            name={`${vector.key}-scalar`}
            value={vector.scalar}
            onChange={this.handleVectorChange}
          />
        </Col>
        <Col sm={1}>
          <Button className="btn-lg"
            variant="delete"
            name={`${vector.key}-del`}
            onClick={this.handleDeleteVector}
          >
            -
          </Button>
        </Col>
      </Form.Group>
    )
  }

  render() {
    return (
      <Container id="form-container" fluid>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row}>
            <Form.Label column sm={2} className="col-form-label-lg label">Term</Form.Label>
            <Col>
              <Form.Control className="form-control-lg"
                type="text" name="term"
                placeholder="e.g. flavor"
                onChange={this.handleChange}
              />
            </Col>
            <Form.Label column sm={2} className="col-form-label-lg label">Return</Form.Label>
            <Col sm={2}>
              <Form.Control className="form-control-lg"
                type="number" name="topn"
                value={this.state.query.topn}
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          {this.renderExtraVectors()}
          <Form.Group as={Row}>
            <Col></Col>
            <Button className="btn-lg" variant="primary"
              onClick={this.handleAddVector}>
              Add vector
            </Button>
            <Col sm={1}></Col>
            <Button className="btn-lg" variant="primary"
              type="submit"
              disabled={!this.state.valid}>
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
