import React, { Component } from 'react';

import {
  AppBar,
} from 'material-ui';

import Releases from './Releases';

export default class App extends Component {

  render() {
    return (
      <div>
        <AppBar title="CAF Tracker" />
        <Releases releases={this.props.releases} />
      </div>
    );
  }

}
