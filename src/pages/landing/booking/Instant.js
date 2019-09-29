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
import { instantProps } from '../../commonProps';
import s from './Instant.module.scss';

class Instant extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchInstantAvailabilitiesByTemporaryServiceId: func.isRequired,
    dispatchGeoLocationsById: func.isRequired,
  };

  state = {
    instantAvailabilitiesByTemporaryServiceId: [],
    locationById: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { instantAvailabilitiesByTemporaryServiceId, userDetail, locationById } = props;
    const {
      instantAvailabilitiesByTemporaryServiceId: cachedInstantAvailabilitiesByTemporaryServiceId,
      userDetail: cachedUserDetail,
      locationById: cachedLocationById,
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

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { match: { params: { id }}, dispatchInstantAvailabilitiesByTemporaryServiceId } = this.props;
    dispatchInstantAvailabilitiesByTemporaryServiceId(id);
  }

  componentDidUpdate(prevProps) {
    const { instantAvailabilitiesByTemporaryServiceId } = prevProps;
    const { dispatchGeoLocationsById } = this.props;
    const { instantAvailabilitiesByTemporaryServiceId: cachedInstantAvailabilitiesByTemporaryServiceId } = this.state;
    if (
      instantAvailabilitiesByTemporaryServiceId !== null &&
      JSON.stringify(instantAvailabilitiesByTemporaryServiceId) !==
      JSON.stringify(cachedInstantAvailabilitiesByTemporaryServiceId)
    ) {
      const sampleSlot = cachedInstantAvailabilitiesByTemporaryServiceId[0];
      if (sampleSlot) {
        const locationId = get(sampleSlot, 'locationId');
        if (locationId) dispatchGeoLocationsById(locationId);
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
    const { instantAvailabilitiesByTemporaryServiceId, userDetail, locationById } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    console.log('instantAvailabilitiesByTemporaryServiceId', instantAvailabilitiesByTemporaryServiceId);
    console.log('locationById', locationById);
    return (
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
    );
  }
}

export default connect(
  instantProps.mapStateToProps,
  instantProps.mapDispatchToProps,
)(Instant);
