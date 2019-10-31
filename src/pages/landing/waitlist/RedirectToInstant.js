import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Loading from 'components/Loading';
import { navigateTo } from 'utils/common';
import { DEFAULT_TIME, regExPattern } from 'utils/constants';
import defaultImage from 'images/providers.jpg';
import { redirectToInstantProps } from '../../commonProps';
import s from './RedirectToInstant.module.scss';

class RedirectToInstant extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchWaitListsById: func.isRequired,
    dispatchSelectBookingDetail: func.isRequired,
    dispatchGetCustomerById: func.isRequired,
    dispatchSetLandingPage: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    waitListsById: {},
    userDetailById: {},
    landingPageFactors: {},
    selectedBookingDetail: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { waitListsById, userDetailById, landingPageFactors, selectedBookingDetail } = props;
    const {
      waitListsById: cachedWaitListById, userDetailById: cachedUserDetailById,
      landingPageFactors: cachedLandingPageFactors, selectedBookingDetail: cachedSelectedBookingDetail,
    } = state;
    const updatedState = {};
    if (
      waitListsById !== null &&
      JSON.stringify(waitListsById) !== JSON.stringify(cachedWaitListById)
    ) {
      updatedState.waitListsById = waitListsById;
    }
    if (
      userDetailById !== null &&
      JSON.stringify(userDetailById) !== JSON.stringify(cachedUserDetailById)
    ) {
      updatedState.userDetailById = userDetailById;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }
    if (
      selectedBookingDetail !== null &&
      JSON.stringify(selectedBookingDetail) !== JSON.stringify(cachedSelectedBookingDetail)
    ) {
      updatedState.selectedBookingDetail = selectedBookingDetail;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { match: { params: { id, orgRef }}, dispatchWaitListsById, dispatchSetLandingPage } = this.props;
    dispatchWaitListsById(id);
    dispatchSetLandingPage({ orgRef });

  }

  componentDidUpdate(prevProps) {
    const {
      dispatchSelectBookingDetail, dispatchGetCustomerById, dispatchSetLandingPage,
    } = this.props;
    const { waitListsById } = prevProps;
    const {
      waitListsById: cachedWaitListsById, userDetailById: cachedUserDetailById, landingPageFactors,
      selectedBookingDetail: cachedSelectedBookingDetail,
    } = this.state;
    if (
      cachedWaitListsById !== null &&
      JSON.stringify(waitListsById) !== JSON.stringify(cachedWaitListsById)
    ) {
      const waitListId = get(cachedWaitListsById, 'waitListId');
      const customerId = get(cachedWaitListsById, 'customerId');
      const availabilityId = get(cachedWaitListsById, 'availabilityId');
      const sName = get(cachedWaitListsById, 'serviceName');
      const serviceId = get(cachedWaitListsById, 'serviceId');
      const pName = get(cachedWaitListsById, 'providerName');
      const pEmail = get(cachedWaitListsById, 'providerEmail');
      const pPhone = get(cachedWaitListsById, 'providerPhone');
      const pAddress = get(cachedWaitListsById, 'fullAddress');
      const pImage = get(cachedWaitListsById, 'imageUrl') || defaultImage;
      const durationSec = get(cachedWaitListsById, 'duration');
      const providerStartSec = get(cachedWaitListsById, 'sstartTime', DEFAULT_TIME).replace(
        regExPattern.ISO_TIME.pattern, regExPattern.ISO_TIME.replaceBy,
      );
      const timezoneId = get(cachedWaitListsById, 'timezoneId');
      dispatchSelectBookingDetail({
        id: availabilityId, waitListId, sName, serviceId, pName, pPhone, pEmail, pImage, pAddress, durationSec,
        providerStartSec, timezoneId,
      });
      if (customerId) {
        dispatchGetCustomerById(customerId);
      }
    }
    if (
      (cachedUserDetailById.id || cachedUserDetailById.userSub) &&
      cachedSelectedBookingDetail.id
    ) {
      const orgRef = get(landingPageFactors, 'orgRef', '');
      navigateTo(`/${orgRef}/booking/confirmation`)();
      dispatchSetLandingPage({ confirmWaitLists: true })
    }
  }

  render() {
    return (
      <div className={s.container}>
        <Loading />
        <div>
          Redirect to Booking Confirmation
        </div>
      </div>
    );
  }
}

export default connect(
  redirectToInstantProps.mapStateToProps,
  redirectToInstantProps.mapDispatchToProps,
)(RedirectToInstant);
