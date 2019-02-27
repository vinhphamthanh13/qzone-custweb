import React from 'react';
import { number, func } from 'prop-types';
import {
  Grid, Typography, ButtonBase,
} from '@material-ui/core';
import {
  providerType, bookingDetailType, serviceType,
} from 'types/global';

import SelectTime from './providerContent/SelectTime';
import styles from './ProviderContent.module.scss';
import DetailDialog from './providerContent/DetailDialog';

export default class ProviderContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDetailDialogOpen: false,
    };
  }

  togggleDetailDialog = () => {
    this.setState(oldState => ({
      isDetailDialogOpen: !oldState.isDetailDialogOpen,
    }));
  }

  render() {
    const {
      provider, initService, bookingDetail, onTimeSelect, duration,
    } = this.props;
    const { isDetailDialogOpen } = this.state;

    return (
      <>
        <DetailDialog
          isDetailDialogOpen={isDetailDialogOpen}
          togggleDetailDialog={this.togggleDetailDialog}
          initService={initService}
        />
        <Grid container wrap="nowrap">
          <Grid item classes={{ item: styles.providerLeftHeader }}>
            <Typography variant="h5">
              {initService.name}
            </Typography>
            <Typography variant="h6">
              {provider.givenName} {provider.familyName}
            </Typography>
            <Typography variant="caption">
              {(initService.description).substring(0, 100)}
              <>...&nbsp;
                <ButtonBase onClick={this.togggleDetailDialog}>
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
