import React, {Component} from 'react';
import IncrementButton from './IncrementButton';
import PropTypes from 'prop-types';

export default class Counter extends Component {
  displayName = Counter.name;

  constructor(props) {
    super(props);
    this.state = {
      count: props.startOn
    };
    this.incrementWith = this
      .incrementWith
      .bind(this);
  }

  incrementWith(value) {
    var newCount = this.state.count + value;
    if (this.props.hasOwnProperty('min') && this.props.min !== null)
      newCount = Math.max(newCount, this.props.min);
    if (this.props.hasOwnProperty('max') && this.props.max !== null)
      newCount = Math.min(newCount, this.props.max);

    this.setState({
      count: newCount
    });
  }

  render() {
    return (
      <div>
        <h2>{this.props.children}</h2>
        <h3>{this.state.count}</h3>
        <IncrementButton onIncrementWith={this.incrementWith} value={-5}>-5</IncrementButton>
        <IncrementButton onIncrementWith={this.incrementWith} value={-1}>-1</IncrementButton>
        <IncrementButton onIncrementWith={this.incrementWith} value={+1}>+1</IncrementButton>
        <IncrementButton onIncrementWith={this.incrementWith} value={+5}>+5</IncrementButton>
      </div>
    );
  }
}

Counter.propTypes = {
  startOn: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  children: PropTypes.node
};
