import React from 'react';
import {
  func,
  objectOf,
  object,
  any,
  arrayOf,
} from 'prop-types';
import {
  chunk,
  // get,
  noop,
} from 'lodash';
import { Typography } from '@material-ui/core';
import DatePicker from 'components/Calendar/DatePicker';
import SubLoading from 'components/SubLoading';
import ProviderContent from './selectProvider/ProviderContent';
import s from './SelectProvider.module.scss';

class SelectProvider extends React.PureComponent {
  onSelectBooking = provider => (time) => {
    console.log(provider);
    console.log(time);
    // this.props.onChange(provider, 'provider');
    // this.props.onChange(time, 'time', this.props.handleNext);
  };
  //
  // handleSelectDate = (date) => {
  //   const { getProviderTimesAction } = this.props;
  //   const {
  //     service,
  //     serviceProviders,
  //   } = this.state;
  //   const availabilityData = {
  //     serviceId: service.id,
  //     serviceProviders,
  //     startSec: date.getTime() / 1000,
  //     toSec: date.getTime() / 1000,
  //   };
  //   if (date.getTime() === today.getTime()) {
  //     // Add the search time slot to 3 minutes in case the request timeout
  //     availabilityData.startSec = (moment.now() + 180000) / 1000;
  //     availabilityData.toSec = (moment.now() + 180000) / 1000;
  //   }
  //   getProviderTimesAction(availabilityData);
  // };

  render() {
    const {
      bookingService,
      providers,
      onDateChange,
    } = this.props;
    return (
      <>
        { bookingService && (
          <div className={s.selectProviderWrapper}>
            <div className={s.selectProviderHeader}>
              <Typography color="textSecondary" variant="title" className="text-bold">
                {bookingService.name}
              </Typography>
              <div className={s.selectDateOfBooking}>
                <DatePicker onChange={onDateChange} selectDate={noop} />
              </div>
            </div>
            {providers ? (
              <div className={s.selectProviderList}>
                {chunk(providers, Math.ceil(providers.length / 4)).map(list => (
                  <div key={Math.random()} className={s.providerRow}>
                    {list.map(provider => (
                      <div key={provider.id}>
                        <ProviderContent
                          service={bookingService}
                          provider={provider}
                          onTimeSelect={this.onSelectBooking(provider)}
                        />
                      </div>))
                    }
                  </div>
                ))}
              </div>
            ) : <SubLoading loading={!providers} />}
          </div>
        )}
      </>
    );
  }
}

SelectProvider.propTypes = {
  bookingService: objectOf(any),
  providers: arrayOf(object),
  onDateChange: func.isRequired,
};

SelectProvider.defaultProps = {
  bookingService: null,
  providers: null,
};

export default SelectProvider;
