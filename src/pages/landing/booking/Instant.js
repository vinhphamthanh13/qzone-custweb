import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import { navigateTo } from 'utils/common';
import { instantProps } from '../../commonProps';
import s from './Instant.module.scss';

class Instant extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchInstantAvailabilitiesByTemporaryServiceId: func.isRequired,
  };

  state = {
    instantAvailabilitiesByTemporaryServiceId: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { instantAvailabilitiesByTemporaryServiceId } = props;
    const {
      instantAvailabilitiesByTemporaryServiceId: cachedInstantAvailabilitiesByTemporaryServiceId,
    } = state;
    const updatedState = {};
    if (
      instantAvailabilitiesByTemporaryServiceId !== null &&
      JSON.stringify(instantAvailabilitiesByTemporaryServiceId) !==
      JSON.stringify(cachedInstantAvailabilitiesByTemporaryServiceId)
    ) {
      updatedState.instantAvailabilitiesByTemporaryServiceId = instantAvailabilitiesByTemporaryServiceId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { match: { params: { id }}, dispatchInstantAvailabilitiesByTemporaryServiceId } = this.props;
    dispatchInstantAvailabilitiesByTemporaryServiceId(id);
  }

  handleRedirectBooking = () => {
    navigateTo('/')();
  };

  render() {
    const { instantAvailabilitiesByTemporaryServiceId } = this.state;
    console.log('instantAvailabilitiesByTemporaryServiceId', instantAvailabilitiesByTemporaryServiceId);
    return (
      <div className={s.container}>
        <div className={s.headline}>
          <div className={`${s.title} ellipsis`}>
            Service Name
          </div>
          <div className={s.navigation}>
            <IconButton color="inherit" onClick={this.handleRedirectBooking}>
              <Home color="inherit" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  instantProps.mapStateToProps,
  instantProps.mapDispatchToProps,
)(Instant);
