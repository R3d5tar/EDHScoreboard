import React, {Component} from 'react';
import { msgHub } from '../messageHub';

export default class MessageHubManager extends Component {

  constructor(props) {
    super(props);
    this.state = {counter: 0, msgHubState: '???', name:'', code: ''};

    msgHub.onStateChange(this.stateChanged.bind(this));
    msgHub.on('PlayerConnected', this.playerConnected.bind(this));
    msgHub.on('Error', this.error.bind(this));

    this.handleInputChange = this.handleInputChange.bind(this);
    this.connectButtonClick = this.connectButtonClick.bind(this);
    this.disconnectButtonClick = this.disconnectButtonClick.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
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
    
    msgHub.connect().then(function () {
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
    return <div>
      <form onSubmit={this.preventDefault}>
        <label>Name:</label>
        <input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} />
        <label>Code:</label>
        <input name="code" type="text" value={this.state.code} onChange={this.handleInputChange} />

        <button onClick={this.connectButtonClick}>Connect</button>
        <button onClick={this.disconnectButtonClick}>Disconnect</button>
        <span>Received Messages: {this.state.counter}</span>
        <span>Connection State: {this.state.msgHubState}</span>
      </form>
    </div>;
  }
}