import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import serviceImg from 'images/service-provider.jpeg';
import {
  Card, CardContent, CardMedia, CardActions,
  Button,
} from '@material-ui/core';
import './ServiceCard.scss';
import { serviceType } from 'types/global';
import ServiceDetail from './serviceCard/ServiceDetail';

export default class ServiceCard extends PureComponent {
  static propTypes = {
    service: serviceType.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  onSelectService = () => {
    this.props.onChange(this.props.service, 'selectedService');
  };

  render() {
    const { service } = this.props;
    return (
      <Card raised classes={{ root: 'service-card' }}>
        <CardMedia
          className="service-card__image"
          image={serviceImg}
        />
        <CardContent className="service-card__service-content">
          <ServiceDetail service={service} />
        </CardContent>
        <CardActions classes={{ root: 'service-card__footer' }}>
          <Button
            color="primary"
            variant="contained"
            onClick={this.onSelectService}
            fullWidth
          >
            Select
          </Button>
        </CardActions>
      </Card>
    );
  }
}
