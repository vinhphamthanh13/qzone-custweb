import React from 'react';
import { func, objectOf, any } from 'prop-types';
import { get } from 'lodash';
import { Typography, Button } from '@material-ui/core';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  PersonPin, Schedule,
  EmailOutlined, CallOutlined,
  Public,
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
import { fetchProviderDetail } from 'reduxModules/provider.actions';
import SelectTime from './SelectTime';
import MapDialog from './MapDialog';
import s from './ProviderContent.module.scss';

class ProviderContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMapDialogOpen: false,
      fetchingStatus: '',
      isSearchTimeSlot: false,
      providerId: '',
    };
  }

  componentDidMount() {
    const { provider, fetchProviderDetail: fetchProviderDetailAction } = this.props;
    const providerId = get(provider, 'providerId');
    fetchProviderDetailAction(providerId);
    this.setState({ providerId });
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

  handleFetchingSlotStatus = (status) => {
    this.setState({
      fetchingStatus: status,
    });
  };

  render() {
    const {
      provider,
      initService,
      bookingDetail,
      onTimeSelect,
      fetchAvailabilityBySpecialIdAction: fetchAvailabilityBySpecialId,
      providerDetail,
    } = this.props;
    const { isSearchTimeSlot, fetchingStatus, providerId } = this.state;
    const serviceName = get(initService, 'name');
    const currentDetail = get(providerDetail, providerId);
    const providerName = get(currentDetail, 'givenName');
    const providerFamily = get(currentDetail, 'familyName');
    const providerEmail = get(currentDetail, 'email');
    const providerPhone = get(currentDetail, 'telephone');
    const providerImage = get(currentDetail, 'providerInformation.image.fileUrl');
    const providerTimeZone = get(currentDetail, 'providerInformation.timeZoneId');
    const { isMapDialogOpen } = this.state;
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
              <div className={s.providerImageWrapper}>
                <img src={providerImage} alt={providerName} className={s.providerImage} />
              </div>
              <div className={s.providerListCardTitle}>
                <Typography variant="title" color="inherit" className="text-bold" noWrap>
                  <CustomLink
                    text={`${providerName} ${providerFamily}`}
                    to={`/provider/${providerId}`}
                    big
                  />
                </Typography>
                <div className={s.providerListCardMap}>
                  <RateStar rating={providerRating} />
                  <div className={s.geoLocation}>
                    <Button onClick={this.toggleMapDialog} className="simple-button">
                      <PersonPin className="icon-brand icon-small" />
                      View map
                    </Button>
                  </div>
                </div>
              </div>
              <div className={s.providerListCardContent}>
                <div className="icon-text">
                  <EmailOutlined className="icon-main icon-small" />
                  <Typography variant="body1" color="inherit" noWrap>
                    {providerEmail}
                  </Typography>
                </div>
                <div className="icon-text">
                  <CallOutlined className="icon-main icon-small" />
                  <Typography variant="body1" color="inherit" noWrap>
                    {providerPhone}
                  </Typography>
                </div>
                <div className="icon-text">
                  <Public className="icon-main icon-small" />
                  <Typography variant="body1" color="inherit" noWrap>
                    {providerTimeZone}
                  </Typography>
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
            {
              fetchingStatus !== 'success' && (
                <div className={s.providerContentSearchSlot}>
                  <Button onClick={this.handleSearchTimeSlot} variant="outlined" className="simple-button">
                    <Search className="icon-normal main-color" />
                    Find slots
                  </Button>
                </div>
              )
            }
            {(isSearchTimeSlot || fetchingStatus === 'success') && (
              <SelectTime
                bookingDetail={bookingDetail}
                providerDetail={provider}
                onChange={onTimeSelect}
                fetchSlot={fetchAvailabilityBySpecialId}
                getSpecialStatus={this.handleFetchingSlotStatus}
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
  fetchProviderDetail: func.isRequired,
  providerDetail: objectOf(any).isRequired,
};

ProviderContent.defaultProps = {
  initService: undefined,
  provider: undefined,
};

const mapStateToProps = state => ({
  providerDetail: state.providerPage.providerDetail,
});

export default connect(mapStateToProps, {
  fetchAvailabilityBySpecialIdAction,
  fetchProviderDetail,
})(ProviderContent);
