import React from 'react';
import {
  number,
  func,
} from 'prop-types';
import { get } from 'lodash';
import { Typography, ButtonBase } from '@material-ui/core';
import moment from 'moment';
import {
  PersonPin, Schedule, EmailOutlined, CallOutlined, PlaceOutlined, AddOutlined,
} from '@material-ui/icons';
import {
  providerType,
  bookingDetailType,
  serviceType,
} from 'types/global';
import formatName from 'utils/formatName';
import QLogo from 'images/quezone-logo.png';
import SelectTime from './providerContent/SelectTime';
import DetailDialog from './providerContent/DetailDialog';
import MapDialog from './MapDialog';

export default class ProviderContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDetailDialogOpen: false,
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
    } = this.props;
    const { isDetailDialogOpen, isMapDialogOpen } = this.state;
    const providerEmail = get(provider, 'email');
    const providerPhone = get(provider, 'telephone');
    const providerWebsite = get(provider, 'website');
    const providerStreet = get(provider, 'geoLocation.streetAddress');
    const providerDistrict = get(provider, 'geoLocation.district');
    const providerState = get(provider, 'geoLocation.state');
    const providerCity = get(provider, 'geoLocation.city');
    const providerCountry = get(provider, 'geoLocation.country');
    const providerPostCode = get(provider, 'geoLocation.postCode');
    const providerTimeZone = get(provider, 'providerInformation.timeZoneId');

    return (
      <>
        <DetailDialog
          isDetailDialogOpen={isDetailDialogOpen}
          toggleDetailDialog={this.toggleDetailDialog}
          initService={initService}
        />
        <MapDialog
          isOpen={isMapDialogOpen}
          toggle={this.toggleMapDialog}
          initService={initService}
          provider={provider}
        />
        <div className="providerListCard">
          <div className="providerListCardContent">
            <div className="providerListCardHeader">
              <div className="providerListCardLogo">
                <div className="providerListCardImg">
                  <img src={QLogo} alt="Q-Provider" width="100%" />
                </div>
              </div>
              <div className="providerListCardTitle">
                <Typography noWrap variant="headline" color="inherit">
                  {formatName({ givenName: provider.givenName, familyName: provider.familyName })}
                </Typography>
              </div>
              <div className="providerListCardMap">
                <ButtonBase onClick={this.toggleMapDialog}>
                  <PersonPin className="icon-normal icon-brand icon-shake" />
                </ButtonBase>
                <Typography noWrap variant="subheading" color="inherit">View map</Typography>
              </div>
              <div className="providerAddress">
                <div className="icon-text">
                  <EmailOutlined className="icon-small icon-brand" />
                  <Typography noWrap variant="body2" color="textSecondary">{providerEmail}</Typography>
                </div>
                <div className="icon-text">
                  <CallOutlined className="icon-small icon-brand" />
                  <Typography noWrap variant="body2" color="textSecondary">{providerPhone}</Typography>
                </div>
                <div className="icon-text">
                  <PlaceOutlined className="icon-small icon-brand" />
                  <Typography noWrap variant="body2" color="textSecondary">
                    {providerStreet}, {providerDistrict}
                  </Typography>
                </div>
                <div className="icon-text">
                  <AddOutlined className="icon-small icon-transparent" />
                  <Typography noWrap variant="body2" color="textSecondary">{providerState}, {providerCity}</Typography>
                </div>
                <div className="icon-text">
                  <AddOutlined className="icon-small icon-transparent" />
                  <Typography noWrap variant="body2" color="textSecondary">
                    {providerCountry}, {providerPostCode}
                  </Typography>
                </div>
                <div className="icon-text">
                  <AddOutlined className="icon-small icon-transparent" />
                  <Typography noWrap variant="body2" color="textSecondary">
                    {providerWebsite || 'https://info.quezone.com.au'}
                  </Typography>
                </div>
                <div className="icon-text">
                  <AddOutlined className="icon-small icon-transparent" />
                  <Typography noWrap variant="body2" color="textSecondary">{providerTimeZone}</Typography>
                </div>
              </div>
            </div>
            <div className="providerListCardDescription">
              <div className="providerListCardDescriptionTop">
                <Typography variant="body1" color="inherit">
                  {initService.description}
                </Typography>
                <div className="providerListCardService">
                  <div className="contentItem">
                    <Schedule className="icon-main" />
                    <Typography variant="subheading" color="primary">
                      {duration} min
                    </Typography>
                  </div>
                  <div className="contentItem">
                    <Typography variant="title" color="inherit">
                      ${parseFloat(Math.random(15) * 100).toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="providerListCardDescriptionBottom">
                <Typography variant="body1" color="inherit">
                  Your current timezone: {moment.tz.guess()}
                </Typography>
              </div>
            </div>
          </div>
          <div className="calendarTime">
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
};

ProviderContent.defaultProps = {
  initService: undefined,
  provider: undefined,
};
