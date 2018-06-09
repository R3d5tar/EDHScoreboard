import * as signalR from '@aspnet/signalr';

export class MessageHub {
  stateChangeFunctions = [];
  msgHubState = 'build';
  connection = null;
  
  constructor() {
    this.connection = new signalR
      .HubConnectionBuilder()
      .withUrl('http://' + document.location.hostname + ':5002/msgHub') //TODO: use make configura
      .build();
  }

  connect() {
    const _self = this;
    return this
      .connection
      .start()
      .then(function () {
        _self.internalSetState('connected');
      })
      .catch(function (err) {
        _self.handleError(err);
      });
    
  }

  disconnect() {
    const _self = this;
    return this
      .connection
      .stop()
      .then(function () { 
        _self.internalSetState('disconnected');
      })
      .catch(function (err) {
        _self.handleError(err);
      });
    
  }

  invoke(...args) {
    const _self = this;
    return this
      .connection
      .invoke(...args)
      .catch(function (err) {
        _self.handleError(err);
      });
  }

  on(actionName, delegateFunction) {
    return this
      .connection
      .on(actionName, delegateFunction);
  }

  onStateChange(delegateFunction) {
    this
      .stateChangeFunctions
      .push(delegateFunction);
  }

  internalSetState(msgHubState) {
    this.msgHubState = msgHubState;
    this.triggerStateChange(msgHubState);
  }

  triggerStateChange(msgHubState) {
    for (var i = 0; i < this.stateChangeFunctions.length; i++) {
      this.stateChangeFunctions[i](msgHubState);
    }
  }

  handleError(err) {
    this.internalSetState('error: ' + err);
  }
}

export const msgHub = new MessageHub();
export default msgHub;
