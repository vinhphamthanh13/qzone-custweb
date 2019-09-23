import React, { Component } from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import defaultPImage from 'images/providers.jpg';
import { Email, PhoneIphone, Place } from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import TemporaryService from 'pages/landing/TemporaryService';
import s from './Provider.module.scss';

class Provider extends Component {
  static propTypes = {
    dispatchAvailabilities: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    serviceId: '',
    providerId: '',
    locationId: '',
    availabilitiesByTemporaryServiceId: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { provider, availabilitiesByTemporaryServiceId } = props;
    const {
      provider: cachedProvider,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
    } = state;
    const updatedState = {};
    if (JSON.stringify(provider) !== JSON.stringify(cachedProvider)) {
      updatedState.provider = provider;
    }
    if (
      JSON.stringify(availabilitiesByTemporaryServiceId) !== JSON.stringify(cachedAvailabilitiesByTemporaryServiceId)
    ) {
      updatedState.availabilitiesByTemporaryServiceId = availabilitiesByTemporaryServiceId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchAvailabilities } = this.props;
    const { provider } = this.state;
    const temporaryServiceIds = get(provider, 'temporaryServiceId');
    const providerId = get(provider, 'providerId');
    const serviceId = get(provider, 'serviceId');
    const locationId = get(provider, 'geoLocation.id');
    this.setState({
      serviceId,
      providerId,
      locationId,
    });
    dispatchAvailabilities(temporaryServiceIds, serviceId, providerId, locationId);
  }

  render() {
    const { provider, serviceId, providerId, locationId, availabilitiesByTemporaryServiceId } = this.state;
    const pName = get(provider, 'givenName');
    const pEmail = get(provider, 'email');
    const pPhone = get(provider, 'telephone');
    const pImage = get(provider, 'imageUrl') || defaultPImage;
    const pAddress = get(provider, 'geoLocation.fullAddress');
    const timeSlots = get(availabilitiesByTemporaryServiceId,`${serviceId}-${providerId}-${locationId}`) || [];
    const slots = timeSlots.length > 0 && timeSlots.filter(slot =>
      slot.serviceId === serviceId && slot.providerId === providerId && slot.locationId === locationId) || [];
    return (
      <div key={providerId} className={s.card}>
        <div className={s.image}>
          <img src={pImage} alt="QProvider" />
        </div>
        <div className={s.content}>
          <div className={s.name}>
            {pName}
          </div>
          <div className={s.item}>
            <PhoneIphone className="icon-small" color="inherit" />
            <span>&nbsp;{pPhone}</span>
          </div>
          <div className={s.item}>
            <Email className="icon-small" color="inherit" />
            <span>&nbsp;{pEmail}</span>
          </div>
          <div className={s.place}>
            <div className={s.item}>
              <Place className="icon-small" color="secondary" />
              <span>&nbsp;{pAddress}</span>
            </div>
          </div>
        </div>
        {slots.length > 0 ? (
          <div className={s.availabilities}>
            <TemporaryService
              serviceId={serviceId}
              providerId={providerId}
              locationId={locationId}
              timeSlots={slots}
            />
          </div>
        ) : <EmptyItem message="No time slot available"/>}
      </div>
    );
  }
}

export default Provider;
