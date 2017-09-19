import React, { Component } from 'react';

import moment from 'moment';
import { concat, map, uniq, uniqBy, isEqual, throttle } from 'lodash';

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

export default class Releases extends Component {

  state = {
    loading: false,
    filters: {
      tag: '',
      chipset: '',
      version: '',
    },
  };

  preload = getPreloadData();

  constructor(props) {
    super(props);

    this.state.releases = props.releases || this.preload;
    this.state.chipsets = uniq(map(this.preload, 'chipset'));
    this.state.versions = uniq(map(this.preload, 'version'));

    this.requestFiltered = throttle(this.requestFiltered, 1000);
  }

  async applyFilters(filter) {
    const filters = { ...this.state.filters, ...filter };
    const releases = concat(this.preload, this.state.releases).filter(item =>
      (!filters.tag || includes(item.tag, filters.tag)) &&
      (!filters.chipset || includes(item.chipset, filters.chipset)) &&
      (!filters.version || includes(item.version, filters.version)));

    this.setState({
      filters,
      releases: uniqBy(releases, 'tag'),
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
      loading: false,
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

  renderTable() {
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
