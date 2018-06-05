import React, {Component} from 'react';
import IncrementButton from './IncrementButton';
import PropTypes from 'prop-types';

export default class Counter extends Component {
  displayName = Counter.name;

  constructor(props) {
    super(props);
    this.state = {
      count:  props.current || props.startOn
    };

    this.setTo = this.setTo.bind(this);
    this.incrementWith = this.incrementWith.bind(this);
  }

  setTo(count) {
    var previousCount = this.state.count;

    this.setState({count: count});

    var hasChanged = count !== previousCount;
    if (hasChanged) {
      this.props.onChanged({source: this, newCount: count, previousCount: previousCount});
    }
  }

  incrementWith(value) {
    var previousCount = this.state.count;
    var newCount = previousCount + value;
    if (this.props.hasOwnProperty('min') && this.props.min !== null && this.props.min !== undefined) 
      newCount = Math.max(newCount, this.props.min);
    if (this.props.hasOwnProperty('max') && this.props.max !== null && this.props.max !== undefined) 
      newCount = Math.min(newCount, this.props.max);

    this.setTo(newCount);
  }

  render() {
    return (
      <div>
        <h2>{this.props.children}</h2>
        <h3>{this.state.count}</h3>
        <IncrementButton onIncrementWith={this.incrementWith} value={-5}>-5</IncrementButton>
        <IncrementButton onIncrementWith={this.incrementWith} value={-1}>-1</IncrementButton>
        <IncrementButton onIncrementWith={this.incrementWith} value={+ 1}>+1</IncrementButton>
        <IncrementButton onIncrementWith={this.incrementWith} value={+ 5}>+5</IncrementButton>
      </div>
    );
  }
}

Counter.propTypes = {
  startOn: PropTypes.number.isRequired,
  current: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  children: PropTypes.node,
  onChanged: PropTypes.func
};


export class CachedCounter extends Component {
  displayName = CachedCounter.name

  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);

    this.delegatedProps = {};
    for (var i in this.props)
      this.delegatedProps[i] = this.props[i];

    this.delegatedProps.onChanged = this.handleChange;
    var currentFromStorage = localStorage.getItem(this.props.id);
    if (currentFromStorage)
      this.delegatedProps.current = parseInt(currentFromStorage, 10);
  }

  handleChange(event) {
    localStorage.setItem(this.props.id, event.newCount);
    if (this.props.onChanged)
      this.props.onChanged(event);
  }

  render() {
    return React.createElement(Counter, this.delegatedProps);
  }
}

CachedCounter.propTypes = {
  id: PropTypes.string.isRequired,
  startOn: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  children: PropTypes.node,
  onChanged: PropTypes.func
};