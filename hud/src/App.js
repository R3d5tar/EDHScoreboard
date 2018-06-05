import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {FetchData} from './components/FetchData';
import {Life} from './components/Life';
import {PlayerDisplay} from './components/PlayerDisplay';

export default class App extends Component {
  displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home}/>
        <Route path='/life' component={Life}/>
        <Route path='/player/:name' component={PlayerDisplay} />
        <Route path='/fetchdata' component={FetchData}/>
      </Layout>
    );
  }
}
