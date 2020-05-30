import React, { Component } from 'react';
import { Switch, Route, matchPath, withRouter } from 'react-router';

import {
  AppBar,
  Drawer,
  FlatButton,
  IconButton,
} from 'material-ui';

import { white } from 'material-ui/styles/colors';

import GitHub from 'mui-icons/cmdi/github';

import Details from './Details';

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
      <span style={{ cursor: 'pointer' }}>
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

    const match = matchPath(this.props.location.pathname, { path: '/:tag' });

    return (
      <div>
        <AppBar
          title={title}
          iconElementRight={actions}
          showMenuIconButton={false}
          onTitleTouchTap={() => this.props.history.push('/')}
        />

        {this.props.children}

        <Drawer
          open={!!match}
          openSecondary
          width={600}
        >
          <Switch>
            <Route path="/:tag" component={Details} />
          </Switch>
        </Drawer>

      </div>
    );
  }

}
