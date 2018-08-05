import React, {Component} from 'react';
import { CachedCounter } from './CachedCounter';
import PropTypes from 'prop-types';

export class PlayerCounter extends Component {
  displayName = PlayerCounter.name;

  render() {
    var id = this.props.player + '/' + this.props.type;
    return <CachedCounter id={id} 
      startOn={this.props.startOn} 
      min={this.props.min}
      max={this.props.max}
      onChanged={this.props.onChanged}>
      {this.props.children}
    </CachedCounter>;
  }
}

PlayerCounter.propTypes = {
  player: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  startOn: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  children: PropTypes.node,
  onChanged: PropTypes.func
};
