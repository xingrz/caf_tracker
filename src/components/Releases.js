import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { stringify, parse } from 'querystring';

import moment from 'moment';
import { concat, map, pickBy, uniq, uniqBy, identity, isEqual, throttle } from 'lodash';

import {
  AutoComplete,
  CircularProgress,
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

import { get } from '../utils/http';

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
  try {
    const root = document.getElementById('root');
    return JSON.parse(root.dataset.releases);
  } catch (e) {
    return [];
  }
}

function includes(text1, text2) {
  return text1.toLowerCase().includes(text2.toLowerCase());
}

function parseSearch(location) {
  if (location && location.search && location.search.startsWith('?')) {
    return parse(location.search.substr(1));
  } else {
    return {};
  }
}

@withRouter
export default class Releases extends Component {

  state = {
    loading: false,
  };

  preload = getPreloadData();

  constructor(props) {
    super(props);

    this.state.filters = props.filters || parseSearch(props.location) || {};
    this.state.releases = props.releases || this.preload;
    this.state.chipsets = uniq(map(this.state.releases, 'chipset'));
    this.state.versions = uniq(map(this.state.releases, 'version'));

    this.requestFiltered = throttle(this.requestFiltered, 1000);
    this.onRowSelection = this.onRowSelection.bind(this);
  }

  async applyFilters(filter) {
    const filters = pickBy({ ...this.state.filters, ...filter }, identity);
    const releases = this.state.releases.filter(item =>
      (!filters.tag || includes(item.tag, filters.tag)) &&
      (!filters.chipset || includes(item.chipset, filters.chipset)) &&
      (!filters.version || includes(item.version, filters.version)));

    this.setState({
      filters,
      releases,
      loading: true,
    });

    this.requestFiltered(filters);
  }

  async requestFiltered(filters) {
    const { query, releases } = await get('/api/releases', { qs: filters });
    if (!isEqual(query, this.state.filters)) {
      return;
    }

    this.setState({
      releases,
      chipsets: uniq(map(releases, 'chipset')),
      versions: uniq(map(releases, 'version')),
      loading: false,
    });

    this.props.history.replace(`/?${stringify(filters)}`);
  }

  onRowSelection([index]) {
    const filters = pickBy(this.state.filters, identity);
    const release = this.state.releases[index];
    this.props.history.push(`/${release.tag}?${stringify(filters)}`);
  }

  renderHeader() {
    const {
      filters,
      chipsets,
      versions,
    } = this.state;

    return (
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>
            <HeaderTextField
              hintText="Tag"
              value={filters.tag}
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
              searchText={filters.chipset || ''}
              onUpdateInput={(chipset) => this.applyFilters({ chipset })}
            />
          </TableHeaderColumn>
          <TableHeaderColumn>
            <HeaderAutoComplete
              hintText="Android"
              dataSource={versions}
              searchText={filters.version || ''}
              onUpdateInput={(version) => this.applyFilters({ version })}
            />
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
    );
  }

  renderTable() {
    const tag = this.props.match.params.tag;
    return (
      <Table fixedHeader onRowSelection={this.onRowSelection}>
        {this.renderHeader()}
        <TableBody showRowHover displayRowCheckbox={false}>
          {this.state.releases.map(release => (
            <TableRow
              key={release.tag}
              selected={release.tag == tag}
              style={{ cursor: 'pointer' }}
            >
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

  render() {
    return (
      <div>
        {this.renderTable()}
        {this.state.loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <CircularProgress />
          </div>
        ) : null}
      </div>
    );
  }

}
