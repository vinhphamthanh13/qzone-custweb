import React from 'react';
import {
  number,
  func,
  arrayOf, any,
} from 'prop-types';
import { get } from 'lodash';
import { Typography, ButtonBase } from '@material-ui/core';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  PersonPin, Schedule, EmailOutlined, CallOutlined, AddOutlined, Public,
} from '@material-ui/icons';
import {
  providerType,
  bookingDetailType,
  serviceType,
} from 'types/global';
import RateStar from 'components/Rating/RateStar';
import CustomLink from 'components/CustomLink';
import formatName from 'utils/formatName';
import SelectTime from './SelectTime';
import MapDialog from './MapDialog';
import s from './ProviderContent.module.scss';

class ProviderContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMapDialogOpen: false,
    };
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
      provider, initService,
      bookingDetail,
      onTimeSelect,
      duration,
      providerList,
    } = this.props;
    const serviceName = get(initService, 'name');
    const { isMapDialogOpen } = this.state;
    const providerId = get(provider, 'id');
    const providerEmail = get(provider, 'email');
    const providerPhone = get(provider, 'telephone');
    const providerWebsite = get(provider, 'website');
    const providerTimeZone = get(provider, 'providerInformation.timeZoneId');
    const providerService = providerList
      .filter(item => providerId === item.providerId && initService.id === item.serviceId);
    const providerRating = get(providerService, '0.rating');

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
                    text={formatName({ givenName: provider.givenName, familyName: provider.familyName })}
                    to={`/provider/${providerId}`}
                    big
                  />
                </Typography>
                <RateStar rating={providerRating} />
              </div>
              <div className={s.providerAddress}>
                <div className={s.providerListCardMap}>
                  <ButtonBase onClick={this.toggleMapDialog}>
                    <PersonPin className="icon-small icon-brand icon-shake" />
                  </ButtonBase>
                  <Typography
                    noWrap
                    variant="subheading"
                    color="inherit"
                    onClick={this.toggleMapDialog}
                    className="hover-pointer text-bold"
                  >View map
                  </Typography>
                </div>
                <div className="icon-text">
                  <EmailOutlined className="icon-small icon-brand" />
                  <Typography noWrap variant="body2" color="inherit">
                    <a href={`mailto: ${providerEmail}`} className={s.website}>
                      {providerEmail}
                    </a>
                  </Typography>
                </div>
                <div className="icon-text">
                  <CallOutlined className="icon-small icon-brand" />
                  <Typography noWrap variant="body2" color="inherit">{providerPhone}</Typography>
                </div>
                <div className="icon-text">
                  <AddOutlined className="icon-small icon-transparent" />
                  <Typography noWrap variant="body2" color="inherit">{providerTimeZone}</Typography>
                </div>
                <div className="icon-text">
                  <Public className="icon-small" />
                  <Typography noWrap variant="body2" color="inherit">
                    <a
                      href={`${providerWebsite || 'https://info.quezone.co'}`}
                      rel="noreferrer noopener"
                      target="_blank"
                      className={s.website}
                    >
                      {`${providerWebsite || 'https://info.quezone.co'}`}
                    </a>
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
            <SelectTime
              bookingDetail={bookingDetail}
              providerDetail={provider}
              onChange={onTimeSelect}
            />
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
  duration: number.isRequired,
  providerList: arrayOf(any).isRequired,
};

ProviderContent.defaultProps = {
  initService: undefined,
  provider: undefined,
};

const mapStateToProps = state => ({
  providerList: state.home.providerList,
});

export default connect(mapStateToProps)(ProviderContent);
