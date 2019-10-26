import React, { Component } from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import { IconButton } from '@material-ui/core';
import defaultPImage from 'images/providers.jpg';
import { Email, PhoneIphone, Place, GpsFixed, DateRange, CheckCircle } from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import MapDialog from 'components/Map/MapDialog';
import RateStar from 'components/Rating/RateStar';
import { limitString, navigateTo } from 'utils/common';
import { ADDRESS_LENGTH } from 'utils/constants';
import TemporaryService from './TemporaryService';
import s from './Provider.module.scss';

class Provider extends Component {
  static propTypes = {
    dispatchAvailabilities: func.isRequired,
    selectBookingDetail: func.isRequired,
    setLandingPage: func.isRequired,
  };

  state = {
    serviceId: '',
    providerId: '',
    locationId: '',
    availabilitiesByTemporaryServiceId: {},
    isOpenMap: false,
    bookedEventId: '',
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { provider, availabilitiesByTemporaryServiceId, bookedEventId, landingPageFactors } = props;
    const {
      provider: cachedProvider, bookedEventId: cachedBookedEventId,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
      landingPageFactors: cachedLandingPageFactors,
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
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
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
    const { selectBookingDetail, setLandingPage } = this.props;
    const { landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef', '');
    selectBookingDetail(slot);
    setLandingPage({ instantBooking: false, confirmWaitLists: false });
    navigateTo(`/${orgRef}/booking/confirmation`)();
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
    const pImage = get(provider, 'providerInformation.image.fileUrl', defaultPImage);
    const pRate = get(provider, 'rating');
    const geoLocation = get(provider, 'geoLocation');
    const pAddress = get(geoLocation, 'fullAddress');
    const timeZoneId = get(provider, 'providerInformation.timeZoneId');
    const timeSlots = get(availabilitiesByTemporaryServiceId,`${serviceId}-${providerId}-${locationId}`,  []);
    const slots = timeSlots.length > 0 && timeSlots.filter(slot =>
      slot.serviceId === serviceId && slot.providerId === providerId && slot.locationId === locationId) || [];
    const transformedSlot = slots.filter(item => item.id !== bookedEventId && item.spotsOpen === 1).map(slot => ({
      ...slot, sName, pName, pEmail, pPhone, pImage, pAddress,
    }));

    return (
      <>
        <MapDialog isOpen={isOpenMap} serviceName={sName} toggle={this.handleMapPopup} geoLocation={geoLocation} />
        <div key={providerId} className={s.card}>
          <div className={s.image}>
            <img src={pImage} alt={pName} className={s.imageZoom} width="100%" height="100%" />
            <div className={s.rateStar}>
              <RateStar rating={pRate} size="small" />
            </div>
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
                <Place className="icon-small hover-pointer" color="secondary" onClick={this.handleMapPopup} />
                <span>&nbsp;{limitString(pAddress, ADDRESS_LENGTH)}</span>
              </div>
            </div>
            <div className={s.item}>
              <GpsFixed className="icon-small" color="inherit" />
              <span>&nbsp;{timeZoneId}</span>
            </div>
          </div>
          <div className={s.searchDate}>
            <IconButton className={`${s.bookNow} simple-button`}>
              <CheckCircle className={`${s.iconSearchDate} border-round-white`} />
              <span>&nbsp;Book now!</span>
            </IconButton>
            <IconButton className={`${s.findDate} simple-button`}>
              <DateRange className={s.iconSearchDate} />
              <span>&nbsp;At a later date</span>
            </IconButton>
          </div>
          {transformedSlot.length > 0 ? (
            <div className={s.availabilities}>
              <TemporaryService
                timeSlots={transformedSlot}
                selectSlot={this.handleSelectSlot}
              />
            </div>
          ) : <EmptyItem message="All slots are booked!" size="normal" />}
        </div>
      </>
    );
  }
}

export default Provider;
