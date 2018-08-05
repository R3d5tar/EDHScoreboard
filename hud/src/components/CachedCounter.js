import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Counter from './Counter';

export class CachedCounter extends Component {
  displayName = CachedCounter.name;
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