import React from 'react';
import { number, func } from 'prop-types';
import { Typography, ButtonBase } from '@material-ui/core';
import { Map } from '@material-ui/icons';
import {
  providerType, bookingDetailType, serviceType,
} from 'types/global';

import formatName from 'utils/formatName';
import QLogo from 'images/quezone-logo.png';
import SelectTime from './providerContent/SelectTime';
import styles from './ProviderContent.module.scss';
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
          <div className="providerListCardLogo">
            <img src={QLogo} alt="Q-Provider" width="100%" />
          </div>
          <div className="providerListCardTitle">
            <Typography variant="h6">
              {formatName({ givenName: provider.givenName, familyName: provider.familyName })}
            </Typography>
            <Typography variant="caption">
              {(initService.description).substring(0, 100)}
              <>...&nbsp;
                <ButtonBase onClick={this.toggleDetailDialog}>
                  <Typography variant="caption" className="providerListCardDescription">
                    MORE
                  </Typography>
                </ButtonBase>
              </>
            </Typography>
          </div>
          <div className="providerListCardService">
            <Typography variant="title">
              $20.00
            </Typography>
            <Typography variant="body1">
              {duration} min
            </Typography>
            <div className="providerListCardMap">
              <ButtonBase onClick={this.toggleMapDialog}>
                <Map className={styles.icon} />
              </ButtonBase>
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
