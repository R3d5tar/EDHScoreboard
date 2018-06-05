import React, {Component} from 'react';
import {PlayerCounter} from './PlayerCounter';
import {Glyphicon} from 'react-bootstrap';
import PropTypes from 'prop-types';

export class Life extends Component {
  displayName = Life.name;

  render() {
    return <PlayerCounter player={this.props.player} type='life' startOn={40} min={0}>
      <Glyphicon glyph='tree-deciduous'/>
      Life
    </PlayerCounter>;
  }
}

Life.propTypes = {
  player: PropTypes.string.isRequired
};
