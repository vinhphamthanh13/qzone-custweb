import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import noop from 'lodash/noop';
import find from 'lodash/find';
import { Formik } from 'formik';
import { IconButton, InputBase } from '@material-ui/core';
import defaultPImage from 'images/providers.jpg';
import { Email, PhoneIphone, Place, GpsFixed, DateRange, CheckCircle, ChevronRight, Clear } from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import MapDialog from 'components/Map/MapDialog';
import RateStar from 'components/Rating/RateStar';
import { limitString, navigateTo } from 'utils/common';
import { ADDRESS_LENGTH } from 'utils/constants';
import { providerProps} from 'pages/commonProps';
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
    providersByServiceId: {},
    providerLocationDates: [],
    dateTmpServices: {},
    initLocation: {},
    popUpLocation: false,
    initTempServiceIdList: [],
  };

  static getDerivedStateFromProps(props, state) {
    const {
      provider, availabilitiesByTemporaryServiceId, bookedEventId, landingPageFactors, providersByServiceId,
    } = props;
    const {
      provider: cachedProvider, bookedEventId: cachedBookedEventId,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
      landingPageFactors: cachedLandingPageFactors,
      providersByServiceId: cachedProvidersByServiceId,
    } = state;
    const updatedState = {};
    if (
      provider !== null &&
      JSON.stringify(provider) !== JSON.stringify(cachedProvider)
    ) {
      updatedState.provider = provider;
      const dateTmpServices = get(provider, 'dateTmpServices');
      const initLocation = dateTmpServices[Object.keys(dateTmpServices)[0]];
      const locationId = Object.keys(dateTmpServices)[0];
      updatedState.dateTmpServices = dateTmpServices;
      updatedState.serviceId = get(provider, 'serviceId');
      const providerLocationDates = dateTmpServices[locationId] || [];
      updatedState.providerLocationDates = providerLocationDates;
      updatedState.initTempServiceIdList = providerLocationDates.length > 0 &&
        providerLocationDates.map(item => item.tmpServiceId);
      updatedState.providerId = get(provider, 'providerId');
      updatedState.initLocation = initLocation;
      updatedState.locationId = locationId;
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
    if (
      providersByServiceId !== null &&
      JSON.stringify(providersByServiceId) !== JSON.stringify(cachedProvidersByServiceId)
    ) {
      updatedState.providersByServiceId = providersByServiceId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchAvailabilities } = this.props;
    const { initTempServiceIdList, serviceId, providerId, locationId } = this.state;
    if (initTempServiceIdList.length) {
      dispatchAvailabilities(initTempServiceIdList, serviceId, providerId, locationId);
    }
  }

  handleMapPopup = () => {
    this.setState(oldState => ({
      isOpenMap: !oldState.isOpenMap,
    }));
  };

  handleChangeLocation = (locationId, setFieldValue) => () => {
    const { dispatchAvailabilities } = this.props;
    const { provider, providerId, serviceId } = this.state;
    const dateTmpServices = get(provider, 'dateTmpServices');
    const providerLocationDates = dateTmpServices[locationId];
    const tempServiceIdList = providerLocationDates.map(item => item.tmpServiceId);
    dispatchAvailabilities(tempServiceIdList, serviceId, providerId, locationId);
    setFieldValue('providerLocation', get(providerLocationDates, '0.locationDetail.fullAddress'));
    this.setState({
      providerLocationDates,
      locationId,
    }, this.togglePopUpLocation);
  };

  handleSelectSlot = (slot) => () => {
    const { selectBookingDetail, setLandingPage } = this.props;
    const { landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef', '');
    selectBookingDetail(slot);
    setLandingPage({ instantBooking: false, confirmWaitLists: false });
    navigateTo(`/${orgRef}/booking/confirmation`)();
  };

  createLocationList = (setFieldValue) => {
    const { dateTmpServices } = this.state;
    return Object.keys(dateTmpServices).map(item => {
      const location = get(dateTmpServices, item);
      const fullAddress = get(location, '0.locationDetail.fullAddress');
      return (
        // eslint-disable-next-line
        <div key={item} className={s.locationItem} onClick={this.handleChangeLocation(item, setFieldValue)}>
          {fullAddress}
        </div>
      )


    })
  };

  togglePopUpLocation = () => {
    this.setState(oldState => ({
      popUpLocation: !oldState.popUpLocation,
    }));
  };

  render() {
    const {
      provider, serviceId, providerId, locationId, availabilitiesByTemporaryServiceId, isOpenMap, dateTmpServices,
      bookedEventId, providersByServiceId, providerLocationDates, initLocation, popUpLocation,
    } = this.state;
    const providerListByServiceId = get(providersByServiceId, serviceId) || [];
    const providerDetail = find(providerListByServiceId, item => item && item.id === providerId);
    const sName = get(provider, 'sName');
    const pName = get(providerDetail, 'givenName');
    const pEmail = get(providerDetail, 'email');
    const pPhone = get(providerDetail, 'telephone');
    const pImage = get(providerDetail, 'providerInformation.image.fileUrl', defaultPImage);
    const pRate = get(providerDetail, 'rating');
    const timeZoneId = get(providerDetail, 'providerInformation.timeZoneId');
    const geoLocation = get(providerLocationDates, '0.locationDetail');
    const pAddress = get(geoLocation, 'fullAddress');
    const timeSlots = get(availabilitiesByTemporaryServiceId,`${serviceId}-${providerId}-${locationId}`,  []);
    const slots = timeSlots.length > 0 && timeSlots.filter(slot =>
      slot.serviceId === serviceId && slot.providerId === providerId && slot.locationId === locationId) || [];
    const transformedSlot = slots.filter(item => item.id !== bookedEventId && item.spotsOpen === 1).map(slot => ({
      ...slot, sName, pName, pEmail, pPhone, pImage, pAddress,
    }));
    const showLocationSelection = dateTmpServices && Object.keys(dateTmpServices).length > 1;

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
                <Formik
                  onSubmit={noop}
                  initialValues={{
                    providerLocation: get(providerLocationDates, '0.locationDetail.fullAddress') ||
                      get(initLocation, '0.locationDetail.fullAddress'),
                  }}
                  render={({ values, setFieldValue }) => (
                    <>
                      <form>
                        <InputBase
                          type="hidden"
                          name="providerLocation"
                          value={values.providerLocation}
                        />
                      </form>
                      <div className={s.providerLocation}>
                        {limitString(values.providerLocation, ADDRESS_LENGTH)}
                      </div>
                      {showLocationSelection && (
                        <ChevronRight
                          className="icon-shake hover-pointer"
                          color="secondary"
                          onClick={this.togglePopUpLocation}
                        />
                      )}
                      {popUpLocation && (
                        <div className={s.popUpLocationWrapper}>
                          <div className={s.popUpLocation}>
                            <div className={s.popUpLocationHeader}>
                              <span>Our Locations</span>
                              <Clear color="secondary" className="hover-pointer" onClick={this.togglePopUpLocation}/>
                            </div>
                            <div className={s.popUpLocationBody}>
                              {this.createLocationList(setFieldValue)}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
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

export default connect(
  providerProps.mapStateToProps,
  providerProps.mapDispatchToProps,
)(Provider);
