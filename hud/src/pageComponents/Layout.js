import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import {PropTypes} from 'prop-types';
import {NavMenu} from '../components/NavMenu';

export class Layout extends Component {
  displayName = Layout.name;

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col sm={3}>
            <NavMenu/>
          </Col>
          <Col sm={9}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.any
};
