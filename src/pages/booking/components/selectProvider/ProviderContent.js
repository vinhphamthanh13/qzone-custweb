import React from 'react';
import {
  func,
} from 'prop-types';
import { get } from 'lodash';
import {
  Typography,
  Button,
} from '@material-ui/core';
import moment from 'moment';
import {
  PersonPin,
  Schedule,
  EmailOutlined,
  Call,
  Public,
} from '@material-ui/icons';
import {
  providerType,
  serviceType,
} from 'types/global';
import RateStar from 'components/Rating/RateStar';
import CustomLink from 'components/CustomLink';
import TimeBoxes from './TimeBoxes';
import MapDialog from '../../../../components/Map/MapDialog';
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
      provider,
      service,
      onTimeSelect,
    } = this.props;
    const { providerId } = this.state;
    const serviceName = get(service, 'name');
    const providerName = get(provider, 'givenName');
    const providerFamily = get(provider, 'familyName');
    const providerEmail = get(provider, 'email');
    const providerPhone = get(provider, 'telephone');
    const providerImage = get(provider, 'providerInformation.image.fileUrl');
    const providerTimeZone = get(provider, 'providerInformation.timeZoneId');
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
                  <Call className="icon-main icon-small" />
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
            </div>
            <div className={s.providerListCardDescriptionBottom}>
              <Typography variant="body1" color="inherit">
                Your current timezone: {moment.tz.guess()}
              </Typography>
            </div>
            <TimeBoxes
              provider={provider}
              onSelectSlot={onTimeSelect}
            />
          </div>
        </div>
      </>
    );
  }
}

ProviderContent.propTypes = {
  service: serviceType,
  provider: providerType,
  onTimeSelect: func.isRequired,
};

ProviderContent.defaultProps = {
  service: null,
  provider: null,
};

export default ProviderContent;
