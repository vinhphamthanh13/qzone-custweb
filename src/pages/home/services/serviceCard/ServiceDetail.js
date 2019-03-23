import React from 'react';
import { func } from 'prop-types';
import { Typography } from '@material-ui/core';
import { AccessTime, Domain } from '@material-ui/icons';
import { serviceType } from 'types/global';
import { get } from 'lodash';
import CustomLink from 'components/CustomLink';
import { READ_MORE_MAX } from 'utils/constants';
import RateStar from 'components/Rating/RateStar';
import styles from './ServiceDetail.module.scss';
import ReadMore from '../readMore/ReadMore';
import LinkedProvider from '../linkedProviders/LinkedProviders';

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

  handleInstantBooking = () => {
    const { instantBooking } = this.props;
    this.handleClose();
    instantBooking();
  };

  render() {
    const { service } = this.props;
    const { isDialogDescOpen } = this.state;
    const serviceName = get(service, 'name');
    const duration = get(service, 'duration');
    const description = get(service, 'description');
    const rating = get(service, 'rating');
    const viewNum = get(service, 'viewNum');
    const orgName = get(service, 'organizationEntity.name');
    const orgId = get(service, 'organizationEntity.id');

    return (
      <>
        <ReadMore
          isOpen={isDialogDescOpen}
          onClose={this.handleClose}
          serviceName={serviceName}
          duration={duration}
          orgName={orgName}
          orgId={orgId}
          orgDescription={description || ''}
          instantBooking={this.handleInstantBooking}
          rating={rating}
          reviews={viewNum}
        />
        <Typography
          variant="subheading"
          classes={{ subheading: styles.title }}
          color="textSecondary"
          noWrap
        >
          {serviceName}
        </Typography>
        <RateStar rating={rating} reviews={viewNum} />
        <div className={styles.serviceDetail}>
          <Typography variant="body1" color="textSecondary">
            {(description || '').split('').length > READ_MORE_MAX
              ? (<>
                { (description || '').substring(0, READ_MORE_MAX)}...&nbsp;
                <CustomLink text="Read more" small to="#" onClick={this.openDialog} />
              </>)
              : description
            }
          </Typography>
        </div>
        <div className={styles.blockItem}>
          <div className={styles.iconInfo}>
            <AccessTime className={styles.icon} />
            <Typography variant="body1" color="primary">{duration} minutes</Typography>
          </div>
          <div className={styles.iconInfo}>
            <Domain className={styles.icon} />
            <Typography variant="body1">
              <CustomLink text={orgName} to={`/organisation/${orgId}`} />
            </Typography>
          </div>
        </div>
        <div className={styles.linkedProviders}>
          <LinkedProvider service={service} />
        </div>
      </>
    );
  }
}

ServiceDetail.propTypes = {
  service: serviceType.isRequired,
  instantBooking: func.isRequired,
};
