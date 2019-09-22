import React, { Component } from 'react';
import { func } from 'prop-types';
import { get, chunk } from 'lodash';
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
    };

    static getDerivedStateFromProps(props, state) {
      const { temporaryServiceIds, providerId, locationId, availabilitiesByTemporaryServiceId } = props;
      const {
        temporaryServiceIds: cachedTemporaryServiceIds,
        providerId: cachedProviderId,
        locationId: cachedLocationId,
        availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
      } = state;
        if (
          temporaryServiceIds.length !== cachedTemporaryServiceIds.length
          || providerId !== cachedProviderId
          || locationId !== cachedLocationId
          || !(Object.is(availabilitiesByTemporaryServiceId, cachedAvailabilitiesByTemporaryServiceId))
        ) {
            return {
              locationId,
              providerId,
              temporaryServiceIds,
              availabilitiesByTemporaryServiceId,
            };
        }

        return null;
    }

    componentDidMount() {
      const { fetchAvailabilities } = this.props;
      const { temporaryServiceIds, providerId, locationId } = this.state;
      if (providerId && temporaryServiceIds.length > 0) {
        fetchAvailabilities(temporaryServiceIds, providerId, locationId);
      }
    }

    render() {
      const { availabilitiesByTemporaryServiceId, providerId, locationId } = this.state;
      console.log('availabilitiesByTemporaryServiceId', availabilitiesByTemporaryServiceId);
      const slots = get(availabilitiesByTemporaryServiceId, `${providerId}${locationId}`) || [];
      return (
        <div className={s.container}>
          {slots.length > 0 && chunk(slots, 3).map(chunkRow => (
            <div className={s.row}>
              {chunkRow.map(slot => (
                <div className={s.slot}>
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
