import * as signalR from '@aspnet/signalr';

export class MessageHub {
  stateChangeFunctions = [];
  msgHubState = 'build';
  connection = null;
  initialized = null;

  constructor() {
    this.initialized = fetch('/env.json')
      .then(response => response.json())
      .then((env) => this.connection = new signalR.HubConnectionBuilder().withUrl(env.backendUrl + '/msgHub').build());
  }

  connect() {
    return this
      .initialized
      .then(() => {
        return this
          .connection
          .start()
          .then(() => this.internalSetState('connected'))
          .catch((err) => this.handleError(err));
      });

  }

  disconnect() {
    return this
      .initialized
      .then(() => {
        return this
          .connection
          .stop()
          .then(() => this.internalSetState('disconnected'))
          .catch((err) => this.handleError(err));
      });
  }

  invoke(...args) {
    return this
      .initialized
      .then(() => this.connection.invoke(...args).catch((err) => {
        this.handleError(err);
      }));
  }

  on(actionName, delegateFunction) {
    return this
      .initialized
      .then(() => this.connection.on(actionName, delegateFunction));
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
