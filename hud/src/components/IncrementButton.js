import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class IncrementButton extends Component {
  handleClick = () => {
    this.props.onIncrementWith(this.props.value);
  }

  render() {
    return (
      <button onClick={this.handleClick}>{this.props.children}</button>
    );
  }
}

IncrementButton.propTypes = {
  onIncrementWith: PropTypes.func,
  value: PropTypes.number,
  children: PropTypes.any
};
