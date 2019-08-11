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
} from 'lodash';
import { Typography, Divider } from '@material-ui/core';
// import SubLoading from 'components/SubLoading';
import { BOOKING } from 'utils/constants';
import ProviderContent from './selectProvider/ProviderContent';
import s from './SelectProvider.module.scss';

class SelectProvider extends React.PureComponent {
  onSelectBooking = provider => (time) => {
    const {
      setBookingDetail,
      setBookingStep,
      scrollBooking,
    } = this.props;
    setBookingDetail({
      provider,
      time,
    });
    setBookingStep(BOOKING.STEPS.CONFIRM_BOOKING);
    scrollBooking();
  };

  render() {
    const {
      bookingService,
      providers,
      handleAuth,
      showPage,
    } = this.props;
    const selectProviderStyle = showPage
      ? s.selectProviderPageShow : `${s.selectProviderPage} ${s.selectProviderList}`;
    const selectProviderWrapperStyle = showPage ? s.selectProviderWrapperPage : s.selectProviderWrapperPage;

    return (
      <>
        { bookingService && (
          <div className={selectProviderWrapperStyle}>
            <div className={s.selectProviderHeader}>
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
                      <ProviderContent
                        key={provider.id}
                        service={bookingService}
                        providers={providers}
                        provider={provider}
                        onTimeSelect={this.onSelectBooking(provider)}
                        handleAuth={handleAuth}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
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
  handleAuth: func.isRequired,
  showPage: bool.isRequired,
  scrollBooking: func.isRequired,
};

SelectProvider.defaultProps = {
  bookingService: null,
  providers: null,
};

export default SelectProvider;
