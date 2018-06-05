import React, {Component} from 'react';
import Counter from './Counter';
import { Glyphicon } from 'react-bootstrap';

export class Life extends Component {
  displayName = Life.name;

  render() {
    return <Counter startOn={40} min={0}>
      <Glyphicon glyph='tree-deciduous' /> Life
    </Counter>;
  }
}