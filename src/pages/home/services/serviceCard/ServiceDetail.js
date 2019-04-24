import React from 'react';
import { Typography } from '@material-ui/core';
import { Domain } from '@material-ui/icons';
import { serviceType } from 'types/global';
import { get } from 'lodash';
import { history } from 'containers/App';
import CustomLink from 'components/CustomLink';
import { READ_MORE_MAX } from 'utils/constants';
import RateStar from 'components/Rating/RateStar';
import s from './ServiceDetail.module.scss';
import ReadMore from '../readMore/ReadMore';

export default class ServiceDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenReadMore: false,
    };
  }

  handleClose = () => {
    this.setState({ isOpenReadMore: false });
  };

  openDialog = (event) => {
    event.preventDefault();
    this.setState({ isOpenReadMore: true });
  };

  handleInstantBooking = () => {
    const { service } = this.props;
    const serviceId = get(service, 'id');
    this.handleClose();
    history.push(`/booking/${serviceId}`);
  };

  render() {
    const { service } = this.props;
    const { isOpenReadMore } = this.state;
    const serviceName = get(service, 'name');
    const description = get(service, 'description');
    const rating = get(service, 'rating');
    const viewNum = get(service, 'viewNum');
    const orgName = get(service, 'organizationEntity.name');
    const orgId = get(service, 'organizationEntity.id');

    return (
      <>
        <ReadMore
          isOpen={isOpenReadMore}
          onClose={this.handleClose}
          serviceName={serviceName}
          orgName={orgName}
          orgId={orgId}
          orgDescription={description || ''}
          instantBooking={this.handleInstantBooking}
          rating={rating}
          reviews={viewNum}
        />
        <Typography
          variant="subheading"
          classes={{ subheading: s.title }}
          color="textSecondary"
          noWrap
        >
          {serviceName}
        </Typography>
        <RateStar rating={rating} reviews={viewNum} />
        <div className={s.serviceDetail}>
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
        <div className={s.blockItem}>
          <div className={s.iconInfo}>
            <Domain className={s.icon} />
            <Typography variant="body1">
              <CustomLink text={orgName} to={`/organization/${orgId}`} />
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
