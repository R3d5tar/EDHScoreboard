import React, {Component} from 'react';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Col
} from 'react-bootstrap';
import {msgHub} from '../messageHub';
import {ButtonGroup} from 'react-bootstrap';

export default class MessageHubManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      msgHubState: '???',
      name: '',
      code: document.location.hash
        ? document
          .location
          .hash
          .substring(1)
        : ''
    };

    msgHub.onStateChange(this.stateChanged.bind(this));
    msgHub.on('PlayerConnected', this.playerConnected.bind(this));
    msgHub.on('Error', this.error.bind(this));

    this.handleInputChange = this
      .handleInputChange
      .bind(this);
    this.connectButtonClick = this
      .connectButtonClick
      .bind(this);
    this.disconnectButtonClick = this
      .disconnectButtonClick
      .bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  playerConnected(name) {
    alert(name + ' just connected!');
    this.setState({
      counter: this.state.counter + 1
    });
  }

  error(message) {
    alert('Error: ' + message);
  }

  stateChanged(msgHubState) {
    this.setState({msgHubState: msgHubState});
  }

  connectButtonClick() {

    msgHub
      .connect()
      .then(function () {
        msgHub.invoke('PlayerConnect', this.state.name, this.state.code);
      }.bind(this));
    return false;
  }

  disconnectButtonClick() {
    msgHub.disconnect();
    return false;
  }

  preventDefault(event) {
    event.preventDefault();
  }

  render() {
    return <Form onSubmit={this.preventDefault}>
      <FormGroup>
        <ControlLabel>What&acute;s your name?</ControlLabel>
        <FormControl
          id="name"
          type="text"
          value={this.state.name}
          placeholder="my name is..."></FormControl>
      </FormGroup>

      <FormGroup>
        <ControlLabel>Invitation only, do you know the password?</ControlLabel>
        <FormControl
          id="code"
          type="text"
          value={this.state.code}
          placeholder="Yes, I do, it's..."></FormControl>
      </FormGroup>

      <ButtonGroup justified>
        <ButtonGroup><Button onClick={this.connectButtonClick} bsStyle="success">Now, let me in!</Button></ButtonGroup>
        <ButtonGroup><Button onClick={this.disconnectButtonClick} bsStyle="danger">Goodbye!</Button></ButtonGroup>
      </ButtonGroup>
      
      <hr/>
      <FormGroup>
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={4}>
              Received Messages
            </Col>
            <Col xs={8}>
              {this.state.counter}
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={4}>
              Connection State
            </Col>
            <Col xs={8}>
              {this.state.msgHubState}
            </Col>
          </FormGroup>
        </Form>
      </FormGroup>
    </Form>;
  }
}