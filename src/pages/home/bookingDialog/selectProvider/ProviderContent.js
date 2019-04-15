import React from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import { Typography, ButtonBase, IconButton } from '@material-ui/core';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  PersonPin, Schedule,
  // EmailOutlined, CallOutlined, Public, AddOutlined,
  Search,
} from '@material-ui/icons';
import {
  providerType,
  bookingDetailType,
  serviceType,
} from 'types/global';
import RateStar from 'components/Rating/RateStar';
import CustomLink from 'components/CustomLink';
import { fetchAvailabilityBySpecialIdAction } from 'reduxModules/home/bookingDialog/specialSlots.actions';
import SelectTime from './SelectTime';
import MapDialog from './MapDialog';
import s from './ProviderContent.module.scss';

class ProviderContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMapDialogOpen: false,
      isSearchTimeSlot: false,
    };
  }

  handleSearchTimeSlot = () => {
    this.setState({
      isSearchTimeSlot: true,
    });
  };

  toggleDetailDialog = () => {
    this.setState(oldState => ({
      isDetailDialogOpen: !oldState.isDetailDialogOpen,
    }));
  };

  toggleMapDialog = () => {
    this.setState(oldState => ({
      isMapDialogOpen: !oldState.isMapDialogOpen,
    }));
  };

  render() {
    const {
      provider, initService,
      bookingDetail,
      onTimeSelect,
      fetchAvailabilityBySpecialIdAction: fetchAvailabilityBySpecialId,
    } = this.props;
    const { isSearchTimeSlot } = this.state;
    const serviceName = get(initService, 'name');
    const providerName = get(provider, 'providerName');
    const { isMapDialogOpen } = this.state;
    const providerId = get(provider, 'providerId');
    const duration = get(provider, 'avgServiceTime');
    const providerRating = get(provider, 'rating');
    return (
      <>
        <MapDialog
          isOpen={isMapDialogOpen}
          toggle={this.toggleMapDialog}
          serviceName={serviceName}
          provider={provider}
        />
        <div className={s.providerListCard}>
          <div className={s.providerListCardContent}>
            <div className={s.providerListCardHeader}>
              <div className={s.providerListCardTitle}>
                <Typography variant="title" color="inherit" className="text-bold" noWrap>
                  <CustomLink
                    text={providerName}
                    to={`/provider/${providerId}`}
                    big
                  />
                </Typography>
                <div className={s.providerListCardMap}>
                  <RateStar rating={providerRating} />
                  <div className={s.geoLocation}>
                    <ButtonBase onClick={this.toggleMapDialog}>
                      <PersonPin className="icon-brand icon-small" />
                    </ButtonBase>
                    <Typography
                      variant="subtitle1"
                      color="inherit"
                      onClick={this.toggleMapDialog}
                      className="hover-pointer"
                      noWrap
                    >View map
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={s.calendarTime}>
            <div className={s.providerListCardService}>
              <div className={s.contentItem}>
                <Schedule className="icon-main" />
                <Typography variant="subheading" color="primary">
                  {duration} minutes
                </Typography>
              </div>
              <div className={s.contentItem}>
                <Typography variant="title" color="secondary">
                  ${parseFloat(Math.random() * 100).toFixed(2)}
                </Typography>
              </div>
            </div>
            <div className={s.providerListCardDescriptionBottom}>
              <Typography variant="body1" color="inherit">
                Your current timezone: {moment.tz.guess()}
              </Typography>
            </div>
            <div className={`${s.providerContentSearchSlot} icon-text`}>
              <IconButton onClick={this.handleSearchTimeSlot} className="button-sm simple-button">
                <Search className="icon-normal fruit-color" />
              </IconButton>
              <Typography
                variant="body1"
                color="inherit"
                onClick={this.handleSearchTimeSlot}
                className="hover-pointer"
              >
                Find available time slots!
              </Typography>
            </div>
            {isSearchTimeSlot && (
              <SelectTime
                bookingDetail={bookingDetail}
                providerDetail={provider}
                onChange={onTimeSelect}
                fetchSlot={fetchAvailabilityBySpecialId}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

ProviderContent.propTypes = {
  initService: serviceType,
  provider: providerType,
  bookingDetail: bookingDetailType.isRequired,
  onTimeSelect: func.isRequired,
  fetchAvailabilityBySpecialIdAction: func.isRequired,
};

ProviderContent.defaultProps = {
  initService: undefined,
  provider: undefined,
};

export default connect(null, {
  fetchAvailabilityBySpecialIdAction,
})(ProviderContent);
