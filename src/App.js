import React from 'react';
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import SimilarForm from "./components/SimilarForm";
import Results from "./components/Results";

import axios from "axios";

import "bootswatch/dist/cosmo/bootstrap.min.css";
import "./App.css";

import logo from './logos/black-sheep_logo-lockup.png'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
    };
  }

  postQuery = async (query) => {
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify(query);
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://q8p8e8b2dk.execute-api.us-east-2.amazonaws.com/dev1/predictmostsimilar", requestOptions)
    .then(response => console.log(response.text()))
    .then(result => console.log(JSON.parse(result).body))
    .catch(error => console.log('error', error));

    // await axios.post('https://q8p8e8b2dk.execute-api.us-east-2.amazonaws.com/dev1', query)
    //   .then(async res => {
    //     const results = res.data.results;
    //     console.log(res.data)
    //     console.log(results)
    //     if (results !== this.state.results) {
    //       await this.setState({ results });
    //       console.log(this.state);
    //     }
    //   })
  }

  validate() {
    const { post, valid } = this.state;

    valid.title = post.title.length > 0;
    valid.room = post.room.length > 0;
    valid.building = post.building !== "-- Select building --";
    valid.images = post.images.length > 0;
    valid.desc = post.desc.length < 251;
    valid.feeds = post.feeds !== "" && post.feeds > 0;

    const validForm = valid.title && valid.room && valid.building &&
      valid.images && valid.desc && valid.feeds;
    this.setState({ validForm });
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
            <SimilarForm
              postQuery={this.postQuery}
            />
            <Results
              results={this.state.results}
            />
          </Container>
        </Container>
      </div>
    );
  }
}
