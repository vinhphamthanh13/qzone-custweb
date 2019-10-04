import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Loading from 'components/Loading';
import { navigateTo } from 'utils/common';
import { regExPattern } from 'utils/constants';
import defaultImage from 'images/providers.jpg';
import { redirectToInstantProps } from '../../commonProps';

class RedirectToInstant extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchWaitListsById: func.isRequired,
    dispatchSelectBookingDetail: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    waitListsById: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { waitListsById } = props;
    const { waitListsById: cachedWaitListById } = state;
    const updatedState = {};
    if (
      waitListsById !== null &&
      JSON.stringify(waitListsById) !== JSON.stringify(cachedWaitListById)
    ) {
      updatedState.waitListsById = waitListsById;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { match: { params: { id }}, dispatchWaitListsById } = this.props;
    dispatchWaitListsById(id);
  }

  componentDidUpdate() {
    const { dispatchSelectBookingDetail } = this.props;
    const { waitListsById } = this.state;
    if (waitListsById !== null) {
      const waitListId = get(waitListsById, 'waitListId');
      const availabilityId = get(waitListsById, 'availabilityId');
      const tempServiceId = get(waitListsById, 'tempServiceId');
      const sName = get(waitListsById, 'serviceName');
      const serviceId = get(waitListsById, 'serviceId');
      const pName = get(waitListsById, 'providerName');
      const pEmail = get(waitListsById, 'providerEmail');
      const pPhone = get(waitListsById, 'providerPhone');
      const pAddress = get(waitListsById, 'fullAddress');
      const pImage = get(waitListsById, 'imageUrl') || defaultImage;
      const durationSec = get(waitListsById, 'duration');
      const providerStartSec = get(waitListsById, 'sstartTime').replace(
        regExPattern.ISO_TIME.pattern, regExPattern.ISO_TIME.replaceBy,
      );
      const timezoneId = get(waitListsById, 'timezoneId');
      dispatchSelectBookingDetail({
        id: availabilityId, waitListId, sName, serviceId, pName, pPhone, pEmail, pImage, pAddress, durationSec,
        providerStartSec, timezoneId,
      });
      if (tempServiceId) navigateTo('/confirm-booking')();
    }
  }

  render() {
    return (
      <div>
        <Loading />
        Redirect to Instant Booking
      </div>
    );
  }
}

export default connect(
  redirectToInstantProps.mapStateToProps, redirectToInstantProps.mapDispatchToProps,
)(RedirectToInstant);
