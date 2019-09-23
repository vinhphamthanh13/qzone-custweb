import React, { Component } from 'react';
import { func } from 'prop-types';
import { get, chunk } from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import { connect } from 'react-redux';
import { providersProps } from 'pages/commonProps';
import s from './TemporaryService.module.scss';

class TemporaryService extends Component {
    static propTypes = {
      fetchAvailabilities: func.isRequired,
    };

    static defaultProps = {
    };

    state = {
      providerId: '',
      locationId: '',
      temporaryServiceIds: [],
      availabilitiesByTemporaryServiceId: {},
    };

    static getDerivedStateFromProps(props, state) {
      const { temporaryServiceIds, providerId, locationId, availabilitiesByTemporaryServiceId, serviceId } = props;
      const {
        providerId: cachedProviderId,
        locationId: cachedLocationId,
        availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
        serviceId: cachedServiceId,
      } = state;
      const updatedState = {};
      if (temporaryServiceIds.length) {
        updatedState.temporaryServiceIds = temporaryServiceIds;
      }
      if (providerId !== cachedProviderId) {
        updatedState.providerId = providerId;
      }
      if (serviceId !== cachedServiceId) {
        updatedState.serviceId = serviceId;
      }
      if (locationId !== cachedLocationId) {
        updatedState.locationId = locationId;
      }
      if (
        JSON.stringify(availabilitiesByTemporaryServiceId) !== JSON.stringify(cachedAvailabilitiesByTemporaryServiceId)
      ) {
        updatedState.availabilitiesByTemporaryServiceId = availabilitiesByTemporaryServiceId;
      }

      return Object.keys(updatedState) ? updatedState : null;
    }

    componentDidMount() {
      const { fetchAvailabilities } = this.props;
      const { temporaryServiceIds, providerId, locationId } = this.state;
      fetchAvailabilities(temporaryServiceIds, providerId, locationId);
    }

    render() {
      const { availabilitiesByTemporaryServiceId, providerId, locationId } = this.state;
      console.log('availabilitiesByTemporaryServiceId', availabilitiesByTemporaryServiceId);
      const slots = get(availabilitiesByTemporaryServiceId, `${providerId}${locationId}`) || [];
      return (
        <div className={s.container}>
          {providerId}{locationId}
          {slots.length > 0 && chunk(slots, 3).map(chunkRow => (
            <div className={s.row} key={uuidv1()}>
              {chunkRow.map(slot => (
                <div className={s.slot} key={slot.id}>
                  {moment(slot.providerStartSec).format('HH:mm A')}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
}

export default connect(
  providersProps.mapStateToProps,
)(TemporaryService);
