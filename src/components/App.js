import React, { Component } from 'react';

import {
  AppBar,
} from 'material-ui';

import Releases from './Releases';

const alphaStyle = {
  fontSize: 12,
  fontFamily: 'monospace',
  fontWeight: 'normal',
  top: '-1em',
};

export default class App extends Component {

  render() {
    return (
      <div>
        <AppBar title={<span>
          CAF Tracker <sup style={alphaStyle}>{"{alpha}"}</sup>
        </span>} />
        <Releases releases={this.props.releases} />
      </div>
    );
  }

}
