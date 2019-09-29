import React, { Component } from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import defaultPImage from 'images/providers.jpg';
import { IconButton } from '@material-ui/core';
import { Email, PhoneIphone, Place, GpsFixed, Map } from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import MapDialog from 'components/Map/MapDialog';
import RateStar from 'components/Rating/RateStar';
import { navigateTo } from 'utils/common';
import TemporaryService from './TemporaryService';
import s from './Provider.module.scss';

class Provider extends Component {
  static propTypes = {
    dispatchAvailabilities: func.isRequired,
    selectBookingDetail: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    serviceId: '',
    providerId: '',
    locationId: '',
    availabilitiesByTemporaryServiceId: {},
    isOpenMap: false,
    bookedEventId: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { provider, availabilitiesByTemporaryServiceId, bookedEventId } = props;
    const {
      provider: cachedProvider, bookedEventId: cachedBookedEventId,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
    } = state;
    const updatedState = {};
    if (
      provider !== null &&
      JSON.stringify(provider) !== JSON.stringify(cachedProvider)
    ) {
      updatedState.provider = provider;
    }
    if (
      bookedEventId !== null &&
      JSON.stringify(bookedEventId) !== JSON.stringify(cachedBookedEventId)
    ) {
      updatedState.bookedEventId = bookedEventId;
    }
    if (
      availabilitiesByTemporaryServiceId !== null &&
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

  handleMapPopup = () => {
    this.setState(oldState => ({
      isOpenMap: !oldState.isOpenMap,
    }));
  };

  handleSelectSlot = (slot) => () => {
    const { selectBookingDetail } = this.props;
    selectBookingDetail(slot);
    navigateTo('/confirm-booking')();
  };

  render() {
    const {
      provider, serviceId, providerId, locationId, availabilitiesByTemporaryServiceId, isOpenMap,
      bookedEventId,
    } = this.state;
    const sName = get(provider, 'serviceName');
    const pName = get(provider, 'givenName');
    const pEmail = get(provider, 'email');
    const pPhone = get(provider, 'telephone');
    const providerInfo = get(provider, 'providerInformation');
    const catName = get(provider, 'catName');
    const pImage = get(providerInfo, 'image.fileUrl', defaultPImage);
    const pRate = get(provider, 'rating');
    const geoLocation = get(provider, 'geoLocation');
    const pAddress = get(geoLocation, 'fullAddress');
    const timeZoneId = get(providerInfo, 'timeZoneId');
    const timeSlots = get(availabilitiesByTemporaryServiceId,`${serviceId}-${providerId}-${locationId}`,  []);
    const slots = timeSlots.length > 0 && timeSlots.filter(slot =>
      slot.serviceId === serviceId && slot.providerId === providerId && slot.locationId === locationId) || [];
    const transformedSlot = slots.filter(item => item.id !== bookedEventId && item.spotsOpen === 1).map(slot => ({
      ...slot, sName, pName, pEmail, pPhone, pImage, pAddress, catName,
    }));

    return (
      <>
        <MapDialog isOpen={isOpenMap} serviceName={sName} toggle={this.handleMapPopup} geoLocation={geoLocation} />
        <div key={providerId} className={s.card}>
          <div className={s.image}>
            <img src={pImage} alt="QProvider" width="100%" height="100%" />
            <div className={s.rateStar}>
              <RateStar rating={pRate} />
            </div>
            <IconButton color="inherit" className={s.viewMap} onClick={this.handleMapPopup}>
              <Map color="inherit" />map
            </IconButton>
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
            <div className={s.item}>
              <GpsFixed className="icon-small" color="inherit" />
              <span>&nbsp;{timeZoneId}</span>
            </div>
          </div>
          {transformedSlot.length > 0 ? (
            <div className={s.availabilities}>
              <TemporaryService
                serviceId={serviceId}
                providerId={providerId}
                locationId={locationId}
                timeSlots={transformedSlot}
                selectSlot={this.handleSelectSlot}
              />
            </div>
          ) : <EmptyItem message="No slot available"/>}
        </div>
      </>
    );
  }
}

export default Provider;
