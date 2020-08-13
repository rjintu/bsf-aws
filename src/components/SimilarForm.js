import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

export default class SimilarForm extends React.Component {
  constructor(props) {
    super(props);

    this.query = {
      term: "",
      topn: "50",
      vectors: []
    }

    this.vector = {
      key: "0",
      term: ""
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

  handleAddPositive = event => {
    const query = this.state.query;
    const vector = Object.assign({}, this.vector);
    let vectorCount = this.state.vectorCount;

    vector.key = vectorCount.toString();
    vector.positive = true;
    query.vectors.push(vector);
    vectorCount = vectorCount + 1;

    this.setState({ query, vectorCount });
    this.validate();
  }

  handleAddNegative = event => {
    const query = this.state.query;
    const vector = Object.assign({}, this.vector);
    let vectorCount = this.state.vectorCount;

    vector.key = vectorCount.toString();
    vector.positive = false;
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

    const key = name.substr(0, name.indexOf("-"));

    for (let i = 0; i < query.vectors.length; i++) {
      if (query.vectors[i].key === key) {
        query.vectors[i].term = value;
        break;
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

    console.log(query);
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
        <Form.Label column sm={2} className="col-form-label-lg pm-text label">
         {vector.positive ? "+" : "-"}
        </Form.Label>
        <Col sm={8}>
          <Form.Control className="form-control-lg"
            type="text"
            name={`${vector.key}-term`}
            placeholder="e.g. flavor"
            onChange={this.handleVectorChange}
          />
        </Col>
        <Col>
          <Button className="btn-lg"
            variant="delete"
            name={`${vector.key}-del`}
            onClick={this.handleDeleteVector}
          >
            Delete
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
            <Col sm={2} className="label"></Col>
            <Col sm={8}>
              <Form.Control className="form-control-lg"
                type="text" name="term"
                placeholder="e.g. flavor"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          {this.renderExtraVectors()}
          <Form.Group as={Row}>
            <Form.Label column sm={2} className="col-form-label-lg label">Return</Form.Label>
            <Col sm={2}>
              <Form.Control className="form-control-lg"
                type="number" name="topn"
                value={this.state.query.topn}
                onChange={this.handleChange}
              />
            </Col>
            <Col sm={{ span: 2, offset: 4}}>
              <ButtonGroup>
                <Button className="btn-lg" variant="primary"
                  onClick={this.handleAddPositive}>
                  +
                </Button>
                <Button className="btn-lg" variant="primary"
                  onClick={this.handleAddNegative}>
                  -
                </Button>
              </ButtonGroup>
            </Col>
            <Col>
              <Button className="btn-lg" variant="primary"
                type="submit"
                disabled={!this.state.valid}>
                Submit
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
