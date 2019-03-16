import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { Typography, TextField, Button } from '@material-ui/core';
// import { GOOGLE_GEO_API_KEY } from 'config/auth';
import { searchProviderByDistance } from 'reduxModules/home.actions';

export const SEARCH_KEY = {
  ADDRESS: 'asAddress',
  RADIUS: 'asRadius',
};

class AdvancedSearch extends Component {
  state = {
    asAddress: '',
    asRadius: null,
  };

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSearch = () => {
    const { searchProviderByDistanceAction, onClose } = this.props;
    const { asAddress, asRadius } = this.state;
    searchProviderByDistanceAction(asAddress, asRadius);
    onClose();
  };

  render() {
    const { onClose } = this.props;
    const { asAddress, asRadius } = this.state;
    return (
      <div className="advanced-search">
        <div className="advanced-search-title">
          <Typography variant="title" color="primary" className="text-bold">
            Advanced Search
          </Typography>
        </div>
        <div className="advanced-search-item">
          <TextField
            fullWidth
            name={SEARCH_KEY.ADDRESS}
            label="Your address"
            onChange={this.handleChange}
            value={asAddress}
            placeholder="e.g, Street, City, Country"
          />
          <Typography variant="caption" color="textSecondary">
            *Precise address that would help you search more accurate result
          </Typography>
        </div>
        <div className="advanced-search-item">
          <TextField
            fullWidth
            name={SEARCH_KEY.RADIUS}
            label="Search radius (km)"
            onChange={this.handleChange}
            value={asRadius}
            placeholder="E.g, 25"
          />
        </div>
        <div className="advanced-search-cta">
          <Button variant="text" type="submit" onClick={onClose}>Cancel</Button>
          <Button variant="outlined" onClick={this.handleSearch}>Go!</Button>
        </div>
      </div>
    );
  }
}

AdvancedSearch.propTypes = {
  onClose: func.isRequired,
  searchProviderByDistanceAction: func.isRequired,
};

export default connect(null, {
  searchProviderByDistanceAction: searchProviderByDistance,
})(AdvancedSearch);
