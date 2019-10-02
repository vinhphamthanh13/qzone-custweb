import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Loading from 'components/Loading';
import { navigateTo } from 'utils/common';
import { redirectToInstantProps } from 'pages/commonProps';

class RedirectToInstant extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchWaitListsById: func.isRequired,
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
    const { waitListsById } = this.state;
    if (waitListsById !== null) {
      const tempServiceId = get(waitListsById, 'tempServiceId');
      if (tempServiceId) navigateTo(`/booking/instant/${tempServiceId}`)();
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
