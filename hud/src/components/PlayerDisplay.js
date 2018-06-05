import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Life}  from './Life';
import { Poison } from './Poison';
import './PlayerDisplay.css';

export class PlayerDisplay extends Component {
  displayName = Life.name;

  render() {
    var name = 'Player One';
    if (this.props.match.params.name)
      name = this.props.match.params.name.replace('-', ' ');
    if (this.props.name) {
      name = this.props.name;
    }
    return <div className='player'>
      <h1>{name}</h1>
      <Life player={name}/>
      <Poison player={name}/>
    </div>;
  }
}

PlayerDisplay.propTypes = {
  match: PropTypes.shape({ 
    params: PropTypes.shape({ 
      name: PropTypes.string 
    })
  }),
  name: PropTypes.string
};