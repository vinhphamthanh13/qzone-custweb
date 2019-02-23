import React from 'react';
import {
  Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
import {
  AccessTime, LocationOn, Star, StarHalf,
} from '@material-ui/icons';
import { serviceType } from 'types/global';
import CustomLink from 'components/CustomLink';
import styles from './ServiceDetail.module.scss';

export default class ServiceDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDialogDescOpen: false,
    };
  }

  handleClose = () => {
    this.setState({ isDialogDescOpen: false });
  };

  openDialog = (event) => {
    event.preventDefault();
    this.setState({ isDialogDescOpen: true });
  };

  render() {
    const { service } = this.props;
    const { isDialogDescOpen } = this.state;
    return (
      <React.Fragment>
        <Dialog
          open={isDialogDescOpen}
          onClose={this.handleClose}
          aria-labelledby="description-dialog"
          classes={{ paper: styles.readMorePaper }}
        >
          <DialogTitle id="description-dialog">
            <Typography variant="subheading" classes={{ subheading: styles.readMoreTitle }} color="primary">
              {service.name}
            </Typography>
            <div className={styles.iconInfo}>
              <Star className={styles.iconStar} />
              <Star className={styles.iconStar} />
              <Star className={styles.iconStar} />
              <Star className={styles.iconStar} />
              <StarHalf className={styles.iconStar} />
            </div>
            <div className={styles.blockItem}>
              <div className={styles.iconInfo}>
                <AccessTime className={styles.icon} />
                <Typography variant="body1" color="primary">{service.duration} minutes</Typography>
              </div>
              <div className={styles.iconInfo}>
                <LocationOn className={styles.icon} />
                <Typography variant="body1">
                  <CustomLink text={service.organization.name} to={`/organisation/${service.organization.id}`} />
                </Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div className={styles.description}>
                {service.description || ''}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Typography
          variant="subheading"
          classes={{ subheading: styles.title }}
          color="textSecondary"
          noWrap
        >
          {service.name}
        </Typography>
        <div className={styles.iconInfo}>
          <Star className={styles.iconStar} />
          <Star className={styles.iconStar} />
          <Star className={styles.iconStar} />
          <Star className={styles.iconStar} />
          <StarHalf className={styles.iconStar} />
        </div>
        <div className={styles.serviceDetail}>
          <Typography variant="body1" color="textSecondary">
            {(service.description || '').split('').length > 180
              && <>
                { (service.description || '').substring(0, 180)}...&nbsp;
                <CustomLink text="Read more" small to="#" onClick={this.openDialog} />
              </>
            }
          </Typography>
        </div>
        <div className={styles.blockItem}>
          <div className={styles.iconInfo}>
            <AccessTime className={styles.icon} />
            <Typography variant="body1" color="primary">{service.duration} minutes</Typography>
          </div>
          <div className={styles.iconInfo}>
            <LocationOn className={styles.icon} />
            <Typography variant="body1">
              <CustomLink text={service.organization.name} to={`/organisation/${service.organization.id}`} />
            </Typography>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ServiceDetail.propTypes = {
  service: serviceType.isRequired,
};
