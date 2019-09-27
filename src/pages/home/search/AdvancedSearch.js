import React, { Component } from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Typography, TextField, Button, IconButton } from '@material-ui/core';
import { Search, Clear } from '@material-ui/icons';
import Geocode from 'react-geocode';
import { GOOGLE_GEO_API_KEY } from 'config/auth';
import { setServiceProviderNearByAction } from 'actionsReducers/home.actions';
import { DISTANCE } from 'utils/constants';
import s from './AdvancedSearch.module.scss';

export const SEARCH_KEY = {
  ADDRESS: 'asAddress',
  RADIUS: 'asRadius',
};

class AdvancedSearch extends Component {
  static propTypes = {
    onClose: func.isRequired,
    handleResult: func.isRequired,
    setServiceProviderNearByAction: func.isRequired,
  };

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

  handleClose = () => {
    const { onClose, handleResult } = this.props;
    onClose(false)();
    handleResult(false)();
  };

  handleOpenResult = () => {
    const { onClose, handleResult } = this.props;
    onClose(false)();
    handleResult(true)();
  };

  handleSearch = async () => {
    const { setServiceProviderNearByAction: setServiceProviderNearBy } = this.props;
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
    setServiceProviderNearBy(dataSearch);
    this.handleOpenResult();
  };

  render() {
    const { asAddress, asRadius } = this.state;
    const submitValid = asAddress.split(',').length > 1 && asRadius > 0;
    const iconSearchStyle = submitValid ? 'icon-main' : 'icon-disabled';
    return (
      <div className={s.advancedSearch}>
        <div className={s.title}>
          <Typography variant="title" color="inherit" className="text-bold">
            Advanced Search
          </Typography>
          <IconButton className="simple-button white-color" onClick={this.handleClose}>
            <Clear color="inherit" />
          </IconButton>
        </div>
        <div className={s.item}>
          <TextField
            fullWidth
            name={SEARCH_KEY.ADDRESS}
            label="Your address"
            onChange={this.handleChange}
            value={asAddress}
            placeholder="e.g, Street, City, Country"
          />
          <Typography variant="caption" color="textSecondary" className={s.helper}>
            *Precise address that would help you search more accurate result
          </Typography>
          <Typography variant="caption" color="textSecondary" className={s.helper}>
            *Valid string template: street, city, country
          </Typography>
        </div>
        <div className={s.cta}>
          <div>
            <TextField
              name={SEARCH_KEY.RADIUS}
              label="Search radius (km)"
              onChange={this.handleChange}
              value={asRadius}
              placeholder="e.g, 25"
            />
            <Typography variant="caption" color="textSecondary" className={s.helper}>
              *Provider near by
            </Typography>
          </div>
          <Button
            disabled={!submitValid}
            variant="outlined"
            className="simple-button hover-outline"
            onClick={this.handleSearch}
            type="submit"
          >
            <Search className={iconSearchStyle} /> Go!
          </Button>
        </div>
      </div>
    );
  }
}


export default connect(null, {
  setServiceProviderNearByAction,
})(AdvancedSearch);
