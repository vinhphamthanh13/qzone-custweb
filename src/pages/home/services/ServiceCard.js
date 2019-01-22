import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import serviceImg from 'images/service-provider.jpeg';
import {
  Card, CardContent, CardMedia, CardActions,
  Button,
} from '@material-ui/core';
import { serviceType } from 'types/global';
import styles from './ServiceCard.module.scss';
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
      <Card raised classes={{ root: styles.serviceCard }}>
        <CardMedia
          className={styles.image}
          image={serviceImg}
        />
        <CardContent className={styles.serviceContent}>
          <ServiceDetail service={service} />
        </CardContent>
        <CardActions classes={{ root: styles.footer }}>
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
