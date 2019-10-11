import React, { Component } from 'react';
import { func } from 'prop-types';
import MapDialog from 'components/Map/MapDialog';
import RateStar from 'components/Rating/RateStar';
import { Email, GpsFixed, PhoneIphone, Place } from '@material-ui/icons';
import TemporaryService from 'pages/landing/provider/TemporaryService';
import EmptyItem from 'components/EmptyItem';
import { get } from 'lodash';
import defaultPImage from 'images/providers.jpg';
import { navigateTo } from 'utils/common';
import s from './ProviderInstant.module.scss';


class ProviderInstant extends Component {
  static propTypes = {
    selectBookingDetail: func.isRequired,
  };

  state = {
    temporaryService: {},
    slots: [],
    isOpenMap: false,
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { temporaryService, slots, landingPageFactors } = props;
    const {
      temporaryService: cachedTemporaryService, slots: cachedSlots, landingPageFactors: cachedLandingPageFactors,
    } = state;
    const updatedState = {};
    if (
      temporaryService !== null &&
      JSON.stringify(temporaryService) !== JSON.stringify(cachedTemporaryService)
    ) {
      updatedState.temporaryService = temporaryService;
    }
    if (
      slots !== null &&
      JSON.stringify(slots) !== JSON.stringify(cachedSlots)
    ) {
      updatedState.slots = slots;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  handleMapPopup = () => {
    this.setState(oldState => ({
      isOpenMap: !oldState.isOpenMap,
    }));
  };

  handleSelectSlot = slot => () => {
    const { selectBookingDetail } = this.props;
    const { landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef');
    navigateTo(`/${orgRef}/confirm-booking`)();
    selectBookingDetail(slot);
  };

  render() {
    const { temporaryService, slots, isOpenMap } = this.state;
    const sName = get(temporaryService, 'serviceName');
    const pName = get(temporaryService, 'givenName');
    const pEmail = get(temporaryService, 'email');
    const pPhone = get(temporaryService, 'telephone');
    const pImage = get(temporaryService, 'providerInformation.image.fileUrl', defaultPImage);
    const pRate = get(temporaryService, 'rating');
    const geoLocation = get(temporaryService, 'geoLocation');
    const pAddress = get(geoLocation, 'fullAddress');
    const timeZoneId = get(temporaryService, 'providerInformation.timeZoneId');
    const transformedSlots = slots.map(slot => ({ ...slot, sName, pName, pEmail, pPhone, pImage, pAddress }));

    return (
      <>
        <MapDialog isOpen={isOpenMap} serviceName={sName} toggle={this.handleMapPopup} geoLocation={geoLocation} />
        <div className={s.title}>
          Available Slots
        </div>
        <div className={s.card}>
          <div className={s.image}>
            <img src={pImage} alt="QProvider" width="100%" height="100%" />
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
                <Place className="icon-small hover-pointer" color="secondary" onClick={this.handleMapPopup}/>
                <span>&nbsp;{pAddress}</span>
              </div>
            </div>
            <div className={s.item}>
              <GpsFixed className="icon-small" color="inherit" />
              <span>&nbsp;{timeZoneId}</span>
            </div>
          </div>
          {transformedSlots.length > 0 ? (
            <div className={s.availabilities}>
              <TemporaryService
                timeSlots={transformedSlots}
                selectSlot={this.handleSelectSlot}
              />
            </div>
          ) : <EmptyItem message="All slots are booked!"/>}
        </div>
      </>
    );
  }
}

export default ProviderInstant;
