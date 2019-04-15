import React from 'react';
import {
  arrayOf, bool, func,
} from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  providerType, serviceType, bookingDetailType,
} from 'types/global';
import { chunk } from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import DatePicker from 'components/Calendar/DatePicker';
import {
  getProvidersByService, getProviderTimes, findSpecialEventsAction,
} from 'reduxModules/home/bookingDialog/selectProvider.actions';
import EmptyItem from 'components/EmptyItem';
import ProviderContent from './selectProvider/ProviderContent';
import s from './SelectProvider.module.scss';

const today = moment();

class SelectProvider extends React.PureComponent {
  state = {
    selectedDate: new Date(today.year(), today.month(), today.date(), 0, 0, 0),
    sameDate: new Date(today.year(), today.month(), today.date(), 0, 0, 0),
  };

  componentDidMount = () => {
    const {
      initService,
      findSpecialEventsAction: findSpecialEvents,
    } = this.props;

    findSpecialEvents(initService.id);
  };

  onSelectBooking = provider => (time) => {
    this.props.onChange(provider, 'provider');
    this.props.onChange(time, 'time', this.props.handleNext);
  };

  handleSelectDate = (date) => {
    const { getProviderTimesAction, providers, initService } = this.props;
    const { sameDate } = this.state;
    this.setState({ selectedDate: date });
    const availabilityData = {
      serviceId: initService.id,
      providers,
      startSec: date.getTime() / 1000,
      toSec: date.getTime() / 1000,
    };
    if (date.getTime() === sameDate.getTime()) {
      // Add the search time slot to 3 minutes in case the request timeout
      availabilityData.startSec = (moment.now() + 180000) / 1000;
      availabilityData.toSec = (moment.now() + 180000) / 1000;
    }
    getProviderTimesAction(availabilityData);
  };

  render() {
    const {
      isLoading, bookingDetail, initService, onChange, specialEvents,
    } = this.props;
    const { selectedDate } = this.state;
    const bookingDetailWithDate = {
      ...bookingDetail,
      selectedDate,
    };
    return (
      <>
        {!isLoading && specialEvents.length === 0 ? <EmptyItem message="No provider available!" />
          : (
            <div className={s.selectProviderWrapper}>
              <div className={s.selectProviderHeader}>
                <div>
                  <Typography color="textSecondary" variant="title" className="text-bold">
                    {initService.name}
                  </Typography>
                </div>
                <div className={s.selectDateOfBooking}>
                  <DatePicker onChange={onChange} selectDate={this.handleSelectDate} />
                </div>
              </div>
              <div className={s.selectProviderList}>
                {chunk(specialEvents, 4).map(list => (
                  <div key={uuidv1()} className={s.providerRow}>
                    {list.map(provider => (
                      <div key={uuidv1()}>
                        <ProviderContent
                          initService={initService}
                          provider={provider}
                          bookingDetail={bookingDetailWithDate}
                          onTimeSelect={this.onSelectBooking(provider)}
                        />
                      </div>))
                    }
                  </div>
                ))}
              </div>
            </div>)
        }
      </>
    );
  }
}

SelectProvider.propTypes = {
  initService: serviceType,
  providers: arrayOf(providerType).isRequired,
  isLoading: bool.isRequired,
  getProviderTimesAction: func.isRequired,
  onChange: func.isRequired,
  bookingDetail: bookingDetailType.isRequired,
  handleNext: func.isRequired,
  findSpecialEventsAction: func.isRequired,
  specialEvents: arrayOf(providerType).isRequired,
};

SelectProvider.defaultProps = {
  initService: undefined,
};

const mapStateToProps = state => ({
  ...state.homeModules.bookingDialogModules.selectProvider,
});

export default connect(mapStateToProps, {
  getProvidersByServiceAction: getProvidersByService,
  getProviderTimesAction: getProviderTimes,
  findSpecialEventsAction,
})(SelectProvider);
