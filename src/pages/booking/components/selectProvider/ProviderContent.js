import React from 'react';
import {
  func,
  arrayOf,
  any,
} from 'prop-types';
import { get } from 'lodash';
import {
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import {
  PersonPin,
  AvTimer,
  Email,
  Call,
  Public,
  LocationOn,
} from '@material-ui/icons';
import {
  providerType,
  serviceType,
} from 'types/global';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import CustomLink from 'components/CustomLink';
import defaultImage from 'images/default-service-card.png';
import WaitListRegistration from '../WaitListRegistration';
import WrappedBox from './WrappedBox';
import s from './ProviderContent.module.scss';

class ProviderContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMapDialogOpen: false,
      providerId: '',
    };
  }

  componentDidMount() {
    const { provider } = this.props;
    const providerId = get(provider, 'providerId');
    this.setState({ providerId });
  }

  toggleMapDialog = () => {
    this.setState(oldState => ({
      isMapDialogOpen: !oldState.isMapDialogOpen,
    }));
  };

  renderTimeBox = (mode) => {
    const {
      providers,
      provider,
      onTimeSelect,
      handleAuth,
    } = this.props;
    return (mode === 'QUEUE' ? (
      <WaitListRegistration handleAuth={handleAuth} providers={providers} initProvider={provider} />
    ) : (
      <WrappedBox
        provider={provider}
        onSelectSlot={onTimeSelect}
      />));
  };

  render() {
    const {
      service,
      provider,
    } = this.props;
    const { providerId } = this.state;
    const serviceName = get(service, 'name');
    const providerName = get(provider, 'givenName');
    const providerFamily = get(provider, 'familyName');
    const providerEmail = get(provider, 'email');
    const providerPhone = get(provider, 'telephone');
    const providerImage = get(provider, 'providerInformation.image.fileUrl') || defaultImage;
    const providerTimeZone = get(provider, 'providerInformation.timeZoneId');
    const { isMapDialogOpen } = this.state;
    const duration = get(provider, 'avgServiceTime');
    const providerRating = get(provider, 'rating');
    const providerMode = get(provider, 'mode');
    const fullAddress = get(provider, 'geoLocation.fullAddress');
    const geoLocation = get(provider, 'geoLocation');

    return (
      <>
        <MapDialog
          isOpen={isMapDialogOpen}
          toggle={this.toggleMapDialog}
          serviceName={serviceName}
          geoLocation={geoLocation}
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
                    className="main-color-04"
                    big
                  />
                </Typography>
                <div className={s.providerListCardMap}>
                  <RateStar rating={providerRating} />
                  <div className={s.geoLocation}>
                    <PersonPin className="icon-brand icon-small" />
                    <Typography
                      variant="body1"
                      color="inherit"
                      className="hover-pointer"
                      onClick={this.toggleMapDialog}
                    >
                      View map
                    </Typography>
                  </div>
                </div>
              </div>
              <div className={s.providerListCardContent}>
                <div className="icon-text">
                  <AvTimer className="icon-main icon-small" />
                  <Typography variant="body1" color="inherit" noWrap>
                    {duration} minutes
                  </Typography>
                </div>
                <div className="icon-text">
                  <Email className="icon-main icon-small" />
                  <Typography variant="body1" color="inherit" noWrap>
                    {providerEmail}
                  </Typography>
                </div>
                <div className="icon-text">
                  <Call className="icon-main icon-small" />
                  <Typography variant="body1" color="inherit" noWrap>
                    {providerPhone}
                  </Typography>
                </div>
                <div className={s.locationService}>
                  <div className="icon-text">
                    <LocationOn className="icon-main icon-small" />
                    <Typography className="full-width text-bold" variant="body1" color="inherit">
                      {fullAddress},
                    </Typography>
                  </div>
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
            {false && (
              <div className={s.providerListCardDescriptionBottom}>
                <Typography variant="body1" color="inherit">
                  Local timezone: {moment.tz.guess()}
                </Typography>
              </div>
            )}
            {this.renderTimeBox(providerMode)}
          </div>
        </div>
      </>
    );
  }
}

ProviderContent.propTypes = {
  service: serviceType,
  providers: arrayOf(any).isRequired,
  provider: providerType,
  onTimeSelect: func.isRequired,
  handleAuth: func.isRequired,
};

ProviderContent.defaultProps = {
  service: null,
  provider: null,
};

export default ProviderContent;
