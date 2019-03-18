import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Grid, Card, CardContent, Typography,
} from '@material-ui/core';
import {
  providerType, serviceType, bookingDetailType, providerDetailsType,
} from 'types/global';
import { getProvidersByService } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import EmptyItem from 'components/EmptyItem';
import ProviderContent from './selectProvider/ProviderContent';
import styles from './SelectProvider.module.scss';
import DateSelect from './selectProvider/DateSelect';

class SelectProvider extends React.PureComponent {
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

  render() {
    const {
      isLoading, providers, bookingDetail, initService, providerDetails,
      onChange,
    } = this.props;
    return (
      <>
        {!isLoading && providers.length === 0
          && <EmptyItem message="No available providers" />}
        <div className={styles.selectProvider}>
          {providers.length > 0 && (
            <div className="calendarSection">
              <DateSelect
                bookingDetail={bookingDetail}
                onChange={onChange}
                providers={providers}
                initServiceId={initService ? initService.id : -1}
              />
              <Typography color="secondary" variant="body2">*Your current timezone {moment.tz.guess()}</Typography>
            </div>
          )}
          <Grid container spacing={16} classes={{ container: styles.providerCardsWrapper }}>
            {providers.map(provider => (
              <Grid item xs={12} md={6} key={provider.id}>
                <Card>
                  <CardContent>
                    <ProviderContent
                      initService={initService}
                      provider={provider}
                      bookingDetail={bookingDetail}
                      duration={providerDetails[provider.id] ? providerDetails[provider.id][0].durationSec : 0}
                      onTimeSelect={this.onSelectBooking(provider)}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
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

export default connect(mapStateToProps, { getProvidersByServiceAction: getProvidersByService })(SelectProvider);
