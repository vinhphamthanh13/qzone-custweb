import React, { PureComponent } from 'react';
import { func } from 'prop-types';
import { noop, get } from 'lodash';
import serviceImg from 'images/service-provider.jpeg';
import {
  Card, CardContent, CardMedia, CardActions,
  Button,
} from '@material-ui/core';
import { serviceType } from 'types/global';
import { history } from 'containers/App';
import styles from './ServiceCard.module.scss';
import ServiceDetail from './serviceCard/ServiceDetail';

export default class ServiceCard extends PureComponent {
  static propTypes = {
    service: serviceType.isRequired,
    onChange: func.isRequired,
    onCloseSearch: func,
  };

  static defaultProps = {
    onCloseSearch: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      isHiddenBooking: false,
      imgSrc: props.service.image && props.service.image.fileUrl
        ? props.service.image.fileUrl : serviceImg,
    };
  }

  onSelectService = () => {
    const { onChange, service, onCloseSearch } = this.props;
    onChange(service, 'selectedService');
    onCloseSearch();
  };

  onError = () => {
    this.setState({ imgSrc: serviceImg });
  };

  handleHidingBookingButton = (value) => {
    this.setState({ isHiddenBooking: value });
  };

  handleRedirectBooking = () => {
    const { service } = this.props;
    const serviceId = get(service, 'id');
    history.push(`/booking/${serviceId}`);
  };

  render() {
    const { service } = this.props;
    const linkedProvider = get(service, 'linkedProvider');
    const { imgSrc, isHiddenBooking } = this.state;
    return (
      <Card raised classes={{ root: styles.serviceCard }}>
        <CardMedia
          className={styles.image}
          image={imgSrc}
          onError={this.onError}
        />
        <CardContent className={styles.serviceContent}>
          <ServiceDetail
            service={service}
            instantBooking={this.onSelectService}
            handleHiddenBookingButton={this.handleHidingBookingButton}
          />
        </CardContent>
        {!isHiddenBooking && (
          <CardActions>
            <Button
              disabled={linkedProvider.length < 1}
              color="primary"
              variant="contained"
              onClick={this.handleRedirectBooking}
              fullWidth
              className={styles.serviceAction}
            >
              Booking
            </Button>
          </CardActions>
        )}
      </Card>
    );
  }
}
