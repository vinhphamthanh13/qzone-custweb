import React from 'react';
import { number, func } from 'prop-types';
import {
  Grid, Typography, ButtonBase,
} from '@material-ui/core';
import { Map } from '@material-ui/icons';
import {
  providerType, bookingDetailType, serviceType,
} from 'types/global';

import formatName from 'utils/formatName';
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
  }

  toggleMapDialog = () => {
    this.setState(oldState => ({
      isMapDialogOpen: !oldState.isMapDialogOpen,
    }));
  }

  render() {
    const {
      provider, initService, bookingDetail, onTimeSelect, duration,
    } = this.props;
    const { isDetailDialogOpen, isMapDialogOpen } = this.state;

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
        <Grid container wrap="nowrap">
          <Grid item classes={{ item: styles.providerLeftHeader }}>
            <Typography variant="h5">
              {initService.name}
            </Typography>
            <Typography variant="h6">
              {formatName({ givenName: provider.givenName, familyName: provider.familyName })}
            </Typography>
            <Typography variant="caption">
              {(initService.description).substring(0, 100)}
              <>...&nbsp;
                <ButtonBase onClick={this.toggleDetailDialog}>
                  <Typography variant="caption" className={styles.providerLeftHeader__description}>
                    MORE
                  </Typography>
                </ButtonBase>
              </>
            </Typography>
          </Grid>
          <Grid item classes={{ item: styles.providerRightHeader }}>
            <Typography variant="title">
              $20.00
            </Typography>
            <Typography variant="body1" classes={{ root: styles.providerRightHeader__duration }}>
              {duration} min
            </Typography>
            <ButtonBase onClick={this.toggleMapDialog}>
              <Map className={styles.icon} />
            </ButtonBase>
          </Grid>
        </Grid>
        <div className={styles.providerDetail}>
          <SelectTime
            bookingDetail={bookingDetail}
            providerDetail={provider}
            onChange={onTimeSelect}
          />
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
