import React from 'react';
import {
  func,
  objectOf,
  object,
  bool,
  any,
  arrayOf,
} from 'prop-types';
import {
  chunk,
  noop,
} from 'lodash';
import { Typography, Divider } from '@material-ui/core';
import DatePicker from 'components/Calendar/DatePicker';
import SubLoading from 'components/SubLoading';
import { BOOKING } from 'utils/constants';
import ProviderContent from './selectProvider/ProviderContent';
import s from './SelectProvider.module.scss';

class SelectProvider extends React.PureComponent {
  onSelectBooking = provider => (time) => {
    const {
      setBookingDetail,
      setBookingStep,
    } = this.props;
    setBookingDetail({
      provider,
      time,
    });
    setBookingStep(BOOKING.STEPS.CONFIRM_BOOKING);
  };

  render() {
    const {
      bookingService,
      providers,
      onDateChange,
      handleAuth,
      showPage,
    } = this.props;
    const selectProviderStyle = showPage
      ? s.selectProviderPage : `${s.selectProviderPage} ${s.selectProviderList}`;

    return (
      <>
        { bookingService && (
          <div className={s.selectProviderWrapper}>
            <div className={s.selectProviderHeader}>
              {showPage && (
                <div className={s.selectDateOfBooking}>
                  <DatePicker onChange={onDateChange} selectDate={noop} enableCalendar={false} />
                </div>
              )}
              <Typography color="inherit" variant="title" className="text-bold">
                {bookingService.name}
              </Typography>
            </div>
            {showPage && <Divider />}
            {providers ? (
              <div className={selectProviderStyle}>
                {chunk(providers, Math.ceil(providers.length / 4)).map(list => (
                  <div key={Math.random()} className={s.providerRow}>
                    {list.map(provider => (
                      <div key={provider.id}>
                        <ProviderContent
                          service={bookingService}
                          providers={providers}
                          provider={provider}
                          onTimeSelect={this.onSelectBooking(provider)}
                          handleAuth={handleAuth}
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
  setBookingDetail: func.isRequired,
  setBookingStep: func.isRequired,
  onDateChange: func.isRequired,
  handleAuth: func.isRequired,
  showPage: bool.isRequired,
};

SelectProvider.defaultProps = {
  bookingService: null,
  providers: null,
};

export default SelectProvider;
