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
import ProviderInstant from './ProviderInstant';
import { instantProps } from '../../commonProps';
import s from './Instant.module.scss';

class Instant extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchInstantAvailabilitiesByTemporaryServiceId: func.isRequired,
    dispatchSelectBookingDetail: func.isRequired,
    dispatchTemporaryServicesById: func.isRequired,
    dispatchUsersById: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
  };

  state = {
    instantAvailabilitiesByTemporaryServiceId: [],
    temporaryServicesById: {},
    providerById: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { instantAvailabilitiesByTemporaryServiceId, userDetail, providerById, temporaryServicesById } = props;
    const {
      instantAvailabilitiesByTemporaryServiceId: cachedInstantAvailabilitiesByTemporaryServiceId,
      userDetail: cachedUserDetail,
      temporaryServicesById: cachedTemporaryServicesById,
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
      providerById !== null &&
      JSON.stringify(providerById) !== JSON.stringify(cachedProviderById)
    ) {
      updatedState.providerById = providerById;
    }
    if (
      temporaryServicesById !== null &&
      JSON.stringify(temporaryServicesById) !== JSON.stringify(cachedTemporaryServicesById)
    ) {
      updatedState.temporaryServicesById = temporaryServicesById;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const {
      match: { params: { id }}, dispatchInstantAvailabilitiesByTemporaryServiceId,
      dispatchTemporaryServicesById, dispatchSetLandingPage
    } = this.props;

    dispatchSetLandingPage({ instantBooking: true, tId: id });
    dispatchInstantAvailabilitiesByTemporaryServiceId(id);
    dispatchTemporaryServicesById(id);
  }

  componentDidUpdate(prevProps) {
    const { temporaryServicesById } = prevProps;
    const { dispatchUsersById } = this.props;
    const { temporaryServicesById: cachedTemporaryServicesById } = this.state;
    if (
      temporaryServicesById !== null &&
      JSON.stringify(temporaryServicesById) !== JSON.stringify(cachedTemporaryServicesById)
    ) {
      const providerId = get(cachedTemporaryServicesById, 'providerId');
      if (providerId) dispatchUsersById(providerId);
    }
  }

  handleViewProfile = id => () => {
    navigateTo(`/profile/${id}`)();
  };

  handleRedirect = () => {
    navigateTo('/')();
  };

  render() {
    const { dispatchSelectBookingDetail } = this.props;
    const {
      instantAvailabilitiesByTemporaryServiceId, userDetail, temporaryServicesById, providerById,
    } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const slots = instantAvailabilitiesByTemporaryServiceId.filter(slot => slot.spotsOpen !== 0);

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
          <div className={s.content}>
            {(!instantAvailabilitiesByTemporaryServiceId || instantAvailabilitiesByTemporaryServiceId.length === 0) ? (
              <EmptyItem message={INSTANT_BOOKING_EMPTY} />
            ) : (
              <ProviderInstant
                selectBookingDetail={dispatchSelectBookingDetail}
                temporaryService={{ ...temporaryServicesById, ...providerById }}
                slots={slots}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  instantProps.mapStateToProps,
  instantProps.mapDispatchToProps,
)(Instant);
