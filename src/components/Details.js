import React, { Component } from 'react';

import {
  AppBar,
  IconButton,
} from 'material-ui';

import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default class Details extends Component {

  render() {
    console.log(this.props);
    return (
      <div>
        <AppBar
          title={this.props.match.params.tag}
          iconElementLeft={
            <IconButton onClick={() => this.props.history.push('/')}>
              <NavigationClose />
            </IconButton>
          }
        />
        <p>哈哈哈哈{this.props.match.params.tag}</p>
      </div>
    );
  }

}
