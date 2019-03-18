import React from 'react';
import { number, func } from 'prop-types';
import { get } from 'lodash';
import { Typography, ButtonBase } from '@material-ui/core';
import { PersonPin, Schedule } from '@material-ui/icons';
import {
  providerType, bookingDetailType, serviceType,
} from 'types/global';

import formatName from 'utils/formatName';
import QLogo from 'images/quezone-logo.png';
import SelectTime from './providerContent/SelectTime';
// import styles from './ProviderContent.module.scss';
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
      provider, initService, bookingDetail, onTimeSelect, duration,
    } = this.props;
    const { isDetailDialogOpen, isMapDialogOpen } = this.state;
    console.log('provider title: --> ', provider);
    console.log('provider bookingDeaati: --> ', bookingDetail);
    console.log('provider initservice: --> ', initService);
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
          <div className="providerListCardHeader">
            <div className="providerListCardTitle">
              <Typography variant="headline" color="inherit">
                {formatName({ givenName: provider.givenName, familyName: provider.familyName })}
              </Typography>
            </div>
            <div className="providerAddress">
              <div className="address1">
                <Typography variant="body2" color="textSecondary">Email: {providerEmail}</Typography>
              </div>
              <div className="address1">
                <Typography variant="body2" color="textSecondary">Tel: {providerPhone}</Typography>
              </div>
              <div className="address1">
                <Typography variant="body2" color="textSecondary">{providerStreet}, {providerDistrict}</Typography>
              </div>
              <div className="address1">
                <Typography variant="body2" color="textSecondary">{providerState}, {providerCity}</Typography>
              </div>
              <div className="address1">
                <Typography variant="body2" color="textSecondary">{providerCountry}, {providerPostCode}</Typography>
              </div>
              <div className="address1">
                <Typography variant="body2" color="textSecondary">{providerTimeZone}</Typography>
              </div>
              <div className="address1">
                <Typography variant="body2" color="textSecondary">{providerWebsite}</Typography>
              </div>
            </div>
            <div className="providerListCardMap">
              <ButtonBase onClick={this.toggleMapDialog}>
                <PersonPin className="icon-main icon-shake" />
              </ButtonBase>
              <Typography variant="subheading" color="inherit">View map</Typography>
            </div>
            <div className="providerListCardLogo">
              <div className="providerListCardImg">
                <img src={QLogo} alt="Q-Provider" width="100%" />
              </div>
            </div>
          </div>
          <div className="providerListCardContent">
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
            <div className="providerListCardAvailableTime">
              <SelectTime
                bookingDetail={bookingDetail}
                providerDetail={provider}
                onChange={onTimeSelect}
              />
            </div>
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
