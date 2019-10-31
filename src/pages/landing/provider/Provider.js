import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import noop from 'lodash/noop';
import { Formik } from 'formik';
import momentz from 'moment-timezone';
import { IconButton, InputBase, Typography } from '@material-ui/core';
import defaultPImage from 'images/providers.jpg';
import { Email, PhoneIphone, Place, GpsFixed, DateRange, CheckCircle, ChevronRight, Clear } from '@material-ui/icons';
import MapDialog from 'components/Map/MapDialog';
import RateStar from 'components/Rating/RateStar';
import { limitString, navigateTo } from 'utils/common';
import DatePicker from 'components/Calendar/DatePicker';
import { ADDRESS_LENGTH, regExPattern } from 'utils/constants';
import { providerProps} from 'pages/commonProps';
import TemporaryService from './TemporaryService';
import s from './Provider.module.scss';

class Provider extends Component {
  static propTypes = {
    dispatchAvailabilities: func.isRequired,
    selectBookingDetail: func.isRequired,
    setLandingPage: func.isRequired,
    dispatchSetBookNowList: func.isRequired,
    dispatchQueryAvailabilitiesByDate: func.isRequired,
  };

  state = {
    serviceId: '',
    providerId: '',
    locationId: '',
    availabilitiesByTemporaryServiceId: {},
    queryAvailabilitiesByTemporaryServiceId: {},
    isOpenMap: false,
    bookedEventId: '',
    landingPageFactors: {},
    providerLocationDates: [],
    dateTmpServices: {},
    initLocation: {},
    popUpLocation: false,
    initTempServiceIdList: [],
    bookNowList: {},
    showDatePicker: false,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      provider, availabilitiesByTemporaryServiceId, bookedEventId, landingPageFactors,
      bookNowList, queryAvailabilitiesByTemporaryServiceId,
    } = props;
    const {
      provider: cachedProvider, bookedEventId: cachedBookedEventId,
      availabilitiesByTemporaryServiceId: cachedAvailabilitiesByTemporaryServiceId,
      landingPageFactors: cachedLandingPageFactors,
      bookNowList: cachedBookNowList,
      queryAvailabilitiesByTemporaryServiceId: cachedQueryAvailabilitiesByTemporaryServiceId,
    } = state;
    const updatedState = {};
    if (
      provider !== null &&
      JSON.stringify(provider) !== JSON.stringify(cachedProvider)
    ) {
      updatedState.provider = provider;
      const dateTmpServices = get(provider, 'dateTmpServices');
      const locationId = Object.keys(dateTmpServices)[0];
      updatedState.dateTmpServices = dateTmpServices;
      updatedState.serviceId = get(provider, 'serviceId');
      const providerLocationDates = dateTmpServices[locationId] || [];
      updatedState.providerLocationDates = providerLocationDates;
      updatedState.initTempServiceIdList = providerLocationDates.length > 0 &&
        providerLocationDates.map(item => item.tmpServiceId);
      updatedState.providerId = get(provider, 'id') || get(provider, 'userSub');
      updatedState.initLocation = dateTmpServices[Object.keys(dateTmpServices)[0]];
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
      bookNowList !== null &&
      JSON.stringify(bookNowList) !== JSON.stringify(cachedBookNowList)
    ) {
      updatedState.bookNowList = bookNowList;
    }
    if (
      queryAvailabilitiesByTemporaryServiceId !== null &&
      JSON.stringify(queryAvailabilitiesByTemporaryServiceId) !==
      JSON.stringify(cachedQueryAvailabilitiesByTemporaryServiceId)
    ) {
      updatedState.queryAvailabilitiesByTemporaryServiceId = queryAvailabilitiesByTemporaryServiceId;
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

  handleBookNow = () => {
    const { setLandingPage } = this.props;
    const { serviceId, providerId, locationId, bookNowList, landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef', '');
    const bookNowSlot = get(bookNowList, `${serviceId}-${providerId}-${locationId}`);
    this.handleSelectSlot(bookNowSlot)();
    setLandingPage({ instantBooking: false, confirmWaitLists: false });
    navigateTo(`/${orgRef}/booking/confirmation`)();
  };

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
      const timezoneId = get(location, '0.locationDetail.timezoneId');
      return (
        // eslint-disable-next-line
        <div key={item} className={s.locationItem} onClick={this.handleChangeLocation(item, setFieldValue)}>
          <span>{fullAddress}</span><br />
          <span>{timezoneId}</span>
        </div>
      )


    })
  };

  togglePopUpLocation = () => {
    this.setState(oldState => ({
      popUpLocation: !oldState.popUpLocation,
    }));
  };

  handleToggleDatePicker = () => {
    this.setState(oldState => ({
      showDatePicker: !oldState.showDatePicker,
    }));
  };

  handleQueryAvailabilitiesByDate = date => {
    const { dispatchQueryAvailabilitiesByDate } = this.props;
    const { serviceId, providerId, locationId } = this.state;
    const unixDate = momentz(date, 'Australia/Sydney').unix();
    const queriedKey = `${serviceId}-${providerId}-${locationId}`;
    dispatchQueryAvailabilitiesByDate({
      date: unixDate, serviceId, providerId,
    }, queriedKey)
  };

  render() {
    const { dispatchSetBookNowList } = this.props;
    const {
      provider, serviceId, providerId, locationId, availabilitiesByTemporaryServiceId, isOpenMap, dateTmpServices,
      bookedEventId, providerLocationDates, initLocation, popUpLocation, showDatePicker,
      queryAvailabilitiesByTemporaryServiceId,
    } = this.state;
    const sName = get(provider, 'sName');
    const pName = get(provider, 'givenName');
    const pEmail = get(provider, 'email');
    const pPhone = get(provider, 'telephone');
    const pImage = get(provider, 'providerInformation.image.fileUrl', defaultPImage);
    const pRate = get(provider, 'rating');
    const timeZoneId = get(provider, 'providerInformation.timeZoneId');
    const geoLocation = get(providerLocationDates, '0.locationDetail');
    const pAddress = get(geoLocation, 'fullAddress');
    const timeSlots = get(availabilitiesByTemporaryServiceId,`${serviceId}-${providerId}-${locationId}`,  []);
    const slots = timeSlots.length > 0 && timeSlots.filter(slot =>
      slot.serviceId === serviceId && slot.providerId === providerId && slot.locationId === locationId) || [];
    const queriedKey = `${serviceId}-${providerId}-${locationId}`;
    const showingQueriedAvailabilities = showDatePicker && queryAvailabilitiesByTemporaryServiceId[queriedKey]  &&
      queryAvailabilitiesByTemporaryServiceId[queriedKey].length > 0;
    const resolvedAvailabilities = showingQueriedAvailabilities ?
      queryAvailabilitiesByTemporaryServiceId[queriedKey] : slots;
    const slotUIs = {};
    const transformedSlot = resolvedAvailabilities
      .filter(item => item.id !== bookedEventId && item.spotsOpen === 1)
      .map(slot => {
        slotUIs[
          slot.providerStartSec.replace(regExPattern.ISO_TIME.patternRemoveTime, regExPattern.ISO_TIME.removeTime)
          ] = true;
        return ({
          ...slot, sName, pName, pEmail, pPhone, pImage, pAddress,
        })
      });
    const showLocationSelection = dateTmpServices && Object.keys(dateTmpServices).length > 1;
    const showLateDate = Object.keys(slotUIs).length > 5 || queryAvailabilitiesByTemporaryServiceId[queriedKey];
    const showBookNow = transformedSlot.length > 0;

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
                              <Clear
                                className="hover-pointer border-round-white white-color"
                                onClick={this.togglePopUpLocation}
                              />
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
              <div className={s.item}>
                <GpsFixed className="icon-small" color="inherit" />
                <span>&nbsp;{timeZoneId}</span>
              </div>
            </div>
          </div>
          {showBookNow && (
            <div className={s.searchDate}>
              <IconButton className={`${s.bookNow} hover-success`} onClick={this.handleBookNow}>
                <CheckCircle className={`${s.iconSearchDate} icon-small border-round-white`} />
                <Typography color="secondary" variant="subtitle2">
                  <span className="hover-success text-shadow-bright">Book now!</span>
                </Typography>
              </IconButton>
              {showLateDate && (
                <div className={`${s.findDate} hover-success`}>
                  <DateRange className={`${s.iconSearchDate} icon-small`} onClick={this.handleToggleDatePicker}/>
                  {!showDatePicker && (
                    <Typography color="secondary" variant="subtitle2" onClick={this.handleToggleDatePicker}>
                      <span className="hover-success text-shadow-bright">At a later date</span>
                    </Typography>
                  )}
                  {showDatePicker && (
                    <DatePicker
                      type="date"
                      openCalendarOnInitial
                      onCancelDatePicker={this.handleToggleDatePicker}
                      onChange={noop}
                      enableCalendar
                      selectDate={this.handleQueryAvailabilitiesByDate}
                    />
                  )}
                  {showDatePicker && (
                    <Clear className="icon-small" color="secondary" onClick={this.handleToggleDatePicker}/>
                  )}
                </div>
              )}
            </div>
          )}
          {transformedSlot.length > 0 && (
            <div className={s.availabilities}>
              <TemporaryService
                onBookNow={dispatchSetBookNowList}
                timeSlots={transformedSlot}
                selectSlot={this.handleSelectSlot}
                searchable={showingQueriedAvailabilities}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default connect(
  providerProps.mapStateToProps,
  providerProps.mapDispatchToProps,
)(Provider);
