import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './pageComponents/Layout';
import {Home} from './pageComponents/Home';
import {PlayerDisplay} from './components/PlayerDisplay';

export default class App extends Component {
  displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home}/>
        <Route path='/player/:name' component={PlayerDisplay} />
      </Layout>
    );
  }
}
