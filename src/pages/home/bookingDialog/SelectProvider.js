import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  providerType, serviceType, bookingDetailType, providerDetailsType,
} from 'types/global';
import moment from 'moment';
import DatePicker from 'components/Calendar/DatePicker';
import { getProvidersByService, getProviderTimes } from 'reduxModules/home/bookingDialog/selectProvider.actions';
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
    const { providers, getProvidersByServiceAction, initService } = this.props;

    if (providers.length === 0) {
      getProvidersByServiceAction(initService.id);
    }
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
      isLoading, providers, bookingDetail, initService, providerDetails,
      onChange,
    } = this.props;
    const { selectedDate } = this.state;
    const bookingDetailWithDate = {
      ...bookingDetail,
      selectedDate,
    };

    return (
      <>
        {!isLoading && providers.length === 0 ? <EmptyItem message="No provider available!" />
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
                {providers.map(provider => (
                  <div key={provider.id}>
                    <ProviderContent
                      initService={initService}
                      provider={provider}
                      bookingDetail={bookingDetailWithDate}
                      duration={providerDetails[provider.id] ? providerDetails[provider.id][0].durationSec : 0}
                      onTimeSelect={this.onSelectBooking(provider)}
                    />
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
  providers: PropTypes.arrayOf(providerType).isRequired,
  providerDetails: PropTypes.shape({
    [PropTypes.string]: providerDetailsType,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  getProvidersByServiceAction: PropTypes.func.isRequired,
  getProviderTimesAction: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  bookingDetail: bookingDetailType.isRequired,
  handleNext: PropTypes.func.isRequired,
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
})(SelectProvider);
