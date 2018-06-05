import React, {Component} from 'react';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
        <h1>EDH HUD</h1>
        <p>This is a &apos;Heads-Up-Display&apos; for your commander game. Use this
          &apos;app&apos; to track your life total or connect to a remote EDH Scoreboard
          to sync your life with it.</p>
      </div>
    );
  }
}
