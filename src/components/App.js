import React, { Component } from 'react';
import { withRouter } from 'react-router';

import {
  AppBar,
  IconButton,
} from 'material-ui';

import { white } from 'material-ui/styles/colors';

import GitHub from 'mui-icons/cmdi/github';

const alphaStyle = {
  fontSize: 12,
  fontFamily: 'monospace',
  fontWeight: 'normal',
  top: '-1em',
};

@withRouter
export default class App extends Component {

  render() {
    const title = (
      <span>
        CAF Tracker <sup style={alphaStyle}>{"{alpha}"}</sup>
      </span>
    );

    const actions = (
      <span>
        <IconButton
          tooltip="Fork me on GitHub"
          tooltipPosition="bottom-left"
          onClick={() => window.open('https://github.com/MoKee/caf_tracker')}
        >
          <GitHub color={white} />
        </IconButton>
      </span>
    );

    return (
      <div>
        <AppBar title={title} iconElementRight={actions} />
        {this.props.children}
      </div>
    );
  }

}
