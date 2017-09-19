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
    filter={AutoComplete.caseInsensitiveFilter}
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

function includes(text1, text2) {
  return text1.toLowerCase().includes(text2.toLowerCase());
}

export default class Releases extends Component {

  constructor(props) {
    super(props);
    this.preload = getPreloadData() || [];
    this.state = {
      releases: props.releases || this.preload,
      chipsets: uniq(map(this.preload, 'chipset')),
      versions: uniq(map(this.preload, 'version')),
      filters: {
        tag: '',
        chipset: '',
        version: '',
      },
    };
  }

  applyFilters(filter) {
    const filters = { ...this.state.filters, ...filter };
    this.setState({
      filters,
      releases: this.preload.filter(item =>
        (!filters.tag || includes(item.tag, filters.tag)) &&
        (!filters.chipset || includes(item.chipset, filters.chipset)) &&
        (!filters.version || includes(item.version, filters.version))
      ),
    });
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
              onChange={(evt, tag) => this.applyFilters({ tag })}
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
              onUpdateInput={(chipset) => this.applyFilters({ chipset })}
            />
          </TableHeaderColumn>
          <TableHeaderColumn>
            <HeaderAutoComplete
              hintText="Android"
              dataSource={versions}
              onUpdateInput={(version) => this.applyFilters({ version })}
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
