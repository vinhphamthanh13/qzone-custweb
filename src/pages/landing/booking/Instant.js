import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { IconButton } from '@material-ui/core';
import { AssignmentInd, Home } from '@material-ui/icons';
import { navigateTo } from 'utils/common';
import { INSTANT_BOOKING_EMPTY } from 'utils/constants';
import Logo from 'images/quezone-logo.png';
import EmptyItem from 'components/EmptyItem';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { instantProps } from '../../commonProps';
import s from './Instant.module.scss';

class Instant extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchInstantAvailabilitiesByTemporaryServiceId: func.isRequired,
    dispatchGeoLocationsById: func.isRequired,
    dispatchServicesById: func.isRequired,
    dispatchUsersById: func.isRequired,
  };

  state = {
    instantAvailabilitiesByTemporaryServiceId: [],
    locationById: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { instantAvailabilitiesByTemporaryServiceId, userDetail, locationById, serviceById, providerById } = props;
    const {
      instantAvailabilitiesByTemporaryServiceId: cachedInstantAvailabilitiesByTemporaryServiceId,
      userDetail: cachedUserDetail,
      locationById: cachedLocationById,
      serviceById: cachedServiceById,
      providerById: cachedProviderById,
    } = state;
    const updatedState = {};
    if (
      instantAvailabilitiesByTemporaryServiceId !== null &&
      JSON.stringify(instantAvailabilitiesByTemporaryServiceId) !==
      JSON.stringify(cachedInstantAvailabilitiesByTemporaryServiceId)
    ) {
      updatedState.instantAvailabilitiesByTemporaryServiceId = instantAvailabilitiesByTemporaryServiceId;
    }
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (
      locationById !== null &&
      JSON.stringify(locationById) !== JSON.stringify(cachedLocationById)
    ) {
      updatedState.locationById = locationById;
    }
    if (
      serviceById !== null &&
      JSON.stringify(serviceById) !== JSON.stringify(cachedServiceById)
    ) {
      updatedState.serviceById = serviceById;
    }
    if (
      providerById !== null &&
      JSON.stringify(providerById) !== JSON.stringify(cachedProviderById)
    ) {
      updatedState.providerById = providerById;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { match: { params: { id }}, dispatchInstantAvailabilitiesByTemporaryServiceId } = this.props;
    dispatchInstantAvailabilitiesByTemporaryServiceId(id);
  }

  componentDidUpdate(prevProps) {
    const { instantAvailabilitiesByTemporaryServiceId } = prevProps;
    const { dispatchGeoLocationsById, dispatchServicesById, dispatchUsersById } = this.props;
    const { instantAvailabilitiesByTemporaryServiceId: cachedInstantAvailabilitiesByTemporaryServiceId } = this.state;
    if (
      instantAvailabilitiesByTemporaryServiceId !== null &&
      JSON.stringify(instantAvailabilitiesByTemporaryServiceId) !==
      JSON.stringify(cachedInstantAvailabilitiesByTemporaryServiceId)
    ) {
      const sampleSlot = cachedInstantAvailabilitiesByTemporaryServiceId[0];
      if (sampleSlot) {
        const locationId = get(sampleSlot, 'locationId');
        const serviceId = get(sampleSlot, 'serviceId');
        const providerId = get(sampleSlot, 'providerId');
        if (locationId) dispatchGeoLocationsById(locationId);
        if (serviceId) dispatchServicesById(serviceId);
        if (providerId) dispatchUsersById(providerId);
      }
    }
  }

  handleViewProfile = id => () => {
    navigateTo(`/profile/${id}`)();
  };

  handleRedirect = () => {
    navigateTo('/')();
  };

  render() {
    const {
      instantAvailabilitiesByTemporaryServiceId, userDetail, locationById, serviceById, providerById,
    } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    console.log('instantAvailabilitiesByTemporaryServiceId', instantAvailabilitiesByTemporaryServiceId);
    console.log('locationById', locationById);
    console.log('serviceById', serviceById);
    console.log('providerById', providerById);
    // const sName = get(serviceById, 'name');
    // const pName = get(providerById, 'givenName') || get(providerById, 'fullName');
    // const pEmail = get(providerById, 'email');
    // const pPhone = get(providerById, 'telephone');
    // const pImage = get(providerById, 'providerInformation.image.fileUrl');
    // const timeZoneId = get(providerById, 'providerInformation.image.timeZoneId');
    // const pRate = get(serviceById, 'rating', 5);
    // const geoLocation = get(locationById, 'coordinates');
    // const pAddress = get(locationById, 'fullAddress');

    return (
      <>
        <Loading />
        <Error />
        <div className={s.container}>
          <div className={s.navBar}>
            <div className={s.logo}>
              <img src={Logo} alt="Quezone Logo" width="100%" height="100%" />
            </div>
            <div className={s.rightCta}>
              <IconButton className="simple-button white-color" onClick={this.handleRedirect}>
                <Home color="inherit" />
              </IconButton>
              {userId && (
                <IconButton className="simple-button white-color" onClick={this.handleViewProfile(userId)}>
                  <AssignmentInd color="inherit" />
                </IconButton>
              )}
            </div>
          </div>
          {(!instantAvailabilitiesByTemporaryServiceId || instantAvailabilitiesByTemporaryServiceId.length === 0) && (
            <EmptyItem message={INSTANT_BOOKING_EMPTY} />
          )}
        </div>
      </>
    );
  }
}

export default connect(
  instantProps.mapStateToProps,
  instantProps.mapDispatchToProps,
)(Instant);
