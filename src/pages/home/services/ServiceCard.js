import React, { PureComponent } from 'react';
import { arrayOf, object } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import serviceImg from 'images/default-service-card.png';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
} from '@material-ui/core';
import { serviceType } from 'types/global';
import { history } from 'containers/App';
import { cacheData, getCachedData } from 'config/localStorage';
import { BOOKING } from 'utils/constants';
import ServiceDetail from './serviceCard/ServiceDetail';
import s from './ServiceCard.module.scss';

class ServiceCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHiddenBooking: false,
      imgSrc: props.service.image && props.service.image.fileUrl
        ? props.service.image.fileUrl : serviceImg,
    };
  }

  onError = () => {
    this.setState({ imgSrc: serviceImg });
  };

  handleBooking = () => {
    const { service, serviceProviders } = this.props;
    const serviceId = get(service, 'id');
    const providers = serviceProviders.filter(provider => provider.serviceId === serviceId);
    history.push(`/booking/${serviceId}`);
    if (!getCachedData(BOOKING.CACHE_DATA)) {
      cacheData(BOOKING.CACHE_DATA, { service, providers });
    }
  };

  render() {
    const { service } = this.props;
    const linkedProvider = get(service, 'linkedProvider');
    const { imgSrc, isHiddenBooking } = this.state;
    return (
      <Card raised classes={{ root: s.serviceCard }}>
        <CardMedia
          className={s.image}
          image={imgSrc}
          onError={this.onError}
        />
        <CardContent className={s.serviceContent}>
          <ServiceDetail
            service={service}
          />
        </CardContent>
        {!isHiddenBooking && (
          <CardActions>
            <Button
              fullWidth
              color="primary"
              variant="outlined"
              className={s.serviceAction}
              disabled={!linkedProvider || linkedProvider.length < 1}
              onClick={this.handleBooking}
            >
              Booking
            </Button>
          </CardActions>
        )}
      </Card>
    );
  }
}

ServiceCard.propTypes = {
  service: serviceType.isRequired,
  serviceProviders: arrayOf(object).isRequired,
};

const mapStateToProps = state => ({
  ...state.home,
});

export default connect(mapStateToProps)(ServiceCard);
