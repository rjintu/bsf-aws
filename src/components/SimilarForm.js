import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

export default class SimilarForm extends React.Component {
  constructor(props) {
    super(props);

    this.query = {
      term: "",
      topn: 1000,
      vectors: []
    }

    this.vector = {
      key: "0",
      term: ""
    }

    this.analogy = {
      p1: "",
      p2: "",
      r1: ""
    }

    this.state = {
      query: Object.assign({}, this.query),
      vectorCount: 0,
      valid: false,
      analogy: Object.assign({}, this.analogy),
      validAnalogy: false
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

  handleClear = event => {
    const query = Object.assign({}, this.query);
    query.vectors = [];
    this.setState({ query });
  }

  handleSubmit = event => {
    event.preventDefault();
    event.returnValue = false;

    this.props.setLoading(true);
    this.props.getQuery(this.state.query, true);
  }

  handleChangeAnalogy = event => {
    const name = event.target.name;
    const value = event.target.value;
    const analogy = this.state.analogy;
    analogy[name] = value;
    this.setState({ analogy });
    this.validateAnalogy();
  }

  handleSubmitAnalogy = event => {
    event.preventDefault();
    event.returnValue = false;
    this.props.setLoading(true);

    const analogy = this.state.analogy;
    const query = Object.assign({}, this.query);
    query.term = analogy.r1;
    query.vectors = [];

    const p2 = Object.assign({}, this.vector);
    p2.term = analogy.p2;
    p2.positive = true;
    query.vectors.push(p2);

    const p1 = Object.assign({}, this.vector);
    p1.term = analogy.p1;
    p1.key = "1";
    p1.positive = false;
    query.vectors.push(p1);

    this.props.getQuery(query, true);
  }

  handlePrevQuery = event => {
    this.props.setLoading(true);
    const index = event.target.name;
    const query = this.props.searches[index].query;
    this.setState({ query });
    this.props.getQuery(query, true);
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

  validateAnalogy() {
    const analogy = this.state.analogy;
    const p1 = analogy.p1.length > 0;
    const p2 = analogy.p2.length > 0;
    const r1 = analogy.r1.length > 0;
    const validAnalogy = p1 && p2 && r1;

    this.setState({ validAnalogy });
  }

  renderExtraVectors() {
    return this.state.query.vectors.map(vector =>
      <Form.Group as={Row} key={vector.key}>
        <Form.Label column sm={1} className="pm-text">
         {vector.positive ? "+" : "-"}
        </Form.Label>
        <Col>
          <Form.Control
            type="text"
            name={`${vector.key}-term`}
            placeholder="e.g. flavor"
            value={vector.term}
            onChange={this.handleVectorChange}
          />
        </Col>
        <Col sm={3}>
          <Button
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

  renderSearches() {
    return this.props.searches.map((query, index) =>
      <Row noGutters key={query.name} className="searches">
        <Col>
          <Button name={index} variant="search" onClick={this.handlePrevQuery}>
            {query.name}
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <>
        <Tab.Container id="form-container" defaultActiveKey="normal">
          <Container fluid id="tabs-container">
            <Nav variant="pills" className="justify-content-center">
              <Nav.Item>
                <Nav.Link eventKey="normal">Normal</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analogies">Analogy</Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
          <Tab.Content>
            <Tab.Pane eventKey="normal">
              <Form onSubmit={this.handleSubmit}>
                <Form.Group as={Row}>
                  <Col>
                    <Form.Control
                      type="text" name="term"
                      placeholder="e.g. flavor"
                      value={this.state.query.term}
                      onChange={this.handleChange}
                    />
                  </Col>
                </Form.Group>
                {this.renderExtraVectors()}
                <Form.Group as={Row}>
                  <Col sm={3}>
                    <ButtonGroup>
                      <Button
                        variant="primary"
                        onClick={this.handleAddPositive}>
                        +
                      </Button>
                      <Button variant="primary"
                        onClick={this.handleAddNegative}>
                        -
                      </Button>
                    </ButtonGroup>
                  </Col>
                  <Col sm={{ span: 3, offset: 3 }} className="right-btn-container">
                    <Button
                      variant="delete"
                      onClick={this.handleClear}>
                      Clear
                    </Button>
                  </Col>
                  <Col sm={3}>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!this.state.valid}>
                      Submit
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="analogies">
              <Form onSubmit={this.handleSubmitAnalogy}>
                <Form.Group as={Row} noGutters>
                  <Col sm={2}>
                    <Form.Control
                      type="text" name="p1"
                      placeholder="cow"
                      value={this.state.analogy.p1}
                      onChange={this.handleChangeAnalogy}
                    />
                  </Col>
                  <Col sm={2} className="analogy-text">
                    is to
                  </Col>
                  <Col  sm={2}>
                    <Form.Control
                      type="text" name="p2"
                      placeholder="beef"
                      value={this.state.analogy.p2}
                      onChange={this.handleChangeAnalogy}
                    />
                  </Col>
                  <Col sm={2} className="analogy-text">
                    as
                  </Col>
                  <Col sm={2}>
                    <Form.Control
                      type="text" name="r1"
                      placeholder="pig"
                      value={this.state.analogy.r1}
                      onChange={this.handleChangeAnalogy}
                    />
                  </Col>
                  <Col sm={2} className="analogy-text">
                    is to
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col sm={{ span: 3, offset: 6 }} className="right-btn-container">
                    <Button
                      variant="delete"
                      onClick={this.handleClear}>
                      Clear
                    </Button>
                  </Col>
                  <Col sm={3}>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!this.state.validAnalogy}>
                      Submit
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <Container className="pl-0 pr-0">
          <Container id="search-title">
            Search History
          </Container>
          {this.renderSearches()}
        </Container>
      </>
    );
  }
}
