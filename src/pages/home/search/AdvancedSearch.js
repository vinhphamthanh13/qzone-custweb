import React, { Component } from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Typography, TextField, Button } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Geocode from 'react-geocode';
import { GOOGLE_GEO_API_KEY } from 'config/auth';
import { searchProviderByDistance } from 'reduxModules/home.actions';
import { DISTANCE } from 'utils/constants';

export const SEARCH_KEY = {
  ADDRESS: 'asAddress',
  RADIUS: 'asRadius',
};

class AdvancedSearch extends Component {
  state = {
    asAddress: '',
    asRadius: '',
  };

  componentDidMount() {
    Geocode.setApiKey(GOOGLE_GEO_API_KEY);
  }

  resolveAddressToLatLng = async address => Geocode.fromAddress(address);

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if ((name === SEARCH_KEY.RADIUS && !/^\d+$/.test(value) && value.length) || value > DISTANCE.EQUATOR) return;
    this.setState({
      [name]: value,
    });
  };

  handleSearch = async () => {
    const { searchProviderByDistanceAction, onClose } = this.props;
    const { asAddress, asRadius } = this.state;
    const geoCode = await this.resolveAddressToLatLng(asAddress);
    const userLocation = get(geoCode, 'results.0.geometry.location');
    const latitude = get(userLocation, 'lat');
    const longitude = get(userLocation, 'lng');
    const dataSearch = {
      coordinates: {
        latitude,
        longitude,
      },
      distance: {
        metric: DISTANCE.KM,
        value: asRadius,
      },
    };
    searchProviderByDistanceAction(dataSearch);
    onClose();
  };

  render() {
    const { onClose } = this.props;
    const { asAddress, asRadius } = this.state;
    const submitValid = asAddress.split(',').length > 2 && asRadius > 0;
    const iconSearchStyle = submitValid ? 'icon-main' : 'icon-disabled';
    return (
      <div className="advanced-search">
        <div className="advanced-search-title">
          <Typography variant="title" color="inherit" className="text-bold">
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
          <Typography variant="caption" color="textSecondary" className="advanced-search-helper">
            *Precise address that would help you search more accurate result
          </Typography>
          <Typography variant="caption" color="textSecondary" className="advanced-search-helper">
            *Valid string template: street, city, country
          </Typography>
        </div>
        <div className="advanced-search-cta">
          <div>
            <TextField
              name={SEARCH_KEY.RADIUS}
              label="Search radius (km)"
              onChange={this.handleChange}
              value={asRadius}
              placeholder="e.g, 25"
            />
            <Typography variant="caption" color="textSecondary" className="advanced-search-helper">
              *Provider near by
            </Typography>
          </div>
          <div className="advanced-search-cta-buttons">
            <Button
              disabled={!submitValid}
              variant="outlined"
              className="simple-button hover-outline"
              onClick={this.handleSearch}
            >
              <Search className={iconSearchStyle} /> Go!
            </Button>
            <Button variant="text" type="submit" className="simple-button" onClick={onClose}>Cancel</Button>
          </div>
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
