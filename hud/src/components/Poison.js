import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {PlayerCounter} from './PlayerCounter';
import {Glyphicon} from 'react-bootstrap';

export class Poison extends Component {
  displayName = Poison.name;

  render() {
    return <PlayerCounter
      player={this.props.player}
      type="poison"
      startOn={0}
      min={0}
      max={10}>
      <Glyphicon glyph='tint'/>
      Poison
    </PlayerCounter>;
  }
}

Poison.propTypes = {
  player: PropTypes.string.isRequired
};
