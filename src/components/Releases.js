import React, { Component } from 'react';

import moment from 'moment';
import { map, uniq } from 'lodash';

import {
  AutoComplete,
  TextField,
} from 'material-ui';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const textStyle = {
  fontSize: 13,
  fontFamily: 'monospace',
  fontWeight: 'normal',
};

const HeaderTextField = ({ ...props }) => (
  <TextField
    fullWidth
    underlineShow={false}
    hintStyle={textStyle}
    inputStyle={textStyle}
    {...props}
  />
);

const HeaderAutoComplete = ({ ...props }) => (
  <AutoComplete
    fullWidth
    openOnFocus
    underlineShow={false}
    hintStyle={textStyle}
    inputStyle={textStyle}
    {...props}
  />
);

function getPreloadData() {
  if (!document) {
    return;
  }

  const root = document.getElementById('root');
  if (!root || !root.dataset || !root.dataset.releases) {
    return;
  }

  return JSON.parse(root.dataset.releases);
}

export default class Releases extends Component {

  constructor(props) {
    super(props);
    const preload = getPreloadData() || [];
    this.state = {
      releases: props.releases || preload,
      chipsets: uniq(map(preload, 'chipset')),
      versions: uniq(map(preload, 'version')),
    };
  }

  renderHeader() {
    const {
      chipsets,
      versions,
    } = this.state;

    return (
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>
            <HeaderTextField
              hintText="Tag"
            />
          </TableHeaderColumn>
          <TableHeaderColumn>
            <HeaderTextField
              hintText="Date"
              readOnly
            />
          </TableHeaderColumn>
          <TableHeaderColumn>
            <HeaderAutoComplete
              hintText="SoC"
              dataSource={chipsets}
            />
          </TableHeaderColumn>
          <TableHeaderColumn>
            <HeaderAutoComplete
              hintText="Android"
              dataSource={versions}
            />
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
  }

  render() {
    return (
      <Table selectable={false}>
        {this.renderHeader()}
        <TableBody showRowHover displayRowCheckbox={false}>
          {this.state.releases.map(release => (
            <TableRow key={release.tag}>
              <TableRowColumn style={textStyle}>{release.tag}</TableRowColumn>
              <TableRowColumn style={textStyle}>
                {moment.utc(release.date).format('YYYY-MM-DD')}
              </TableRowColumn>
              <TableRowColumn style={textStyle}>{release.chipset}</TableRowColumn>
              <TableRowColumn style={textStyle}>{release.version}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

}
