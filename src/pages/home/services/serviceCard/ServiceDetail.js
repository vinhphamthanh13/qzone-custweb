import React from 'react';
import {
  Typography,
  // Button,
  // Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
import { AccessTime, LocationOn } from '@material-ui/icons';
import { serviceType } from 'types/global';
import CustomLink from 'components/CustomLink';
import styles from './ServiceDetail.module.scss';
import RateStar from '../rating/RateStar';
import ReadMore from '../readMore/ReadMore';

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
      <>
        <ReadMore
          isOpen={isDialogDescOpen}
          onClose={this.handleClose}
          serviceName={service.name}
          duration={service.duration}
          orgName={service.organization.name}
          orgId={service.organization.id}
          orgDescription={service.description || ''}
        />
        <Typography
          variant="subheading"
          classes={{ subheading: styles.title }}
          color="textSecondary"
          noWrap
        >
          {service.name}
        </Typography>
        <RateStar rating={5} reviews={4000} />
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
      </>
    );
  }
}

ServiceDetail.propTypes = {
  service: serviceType.isRequired,
};
