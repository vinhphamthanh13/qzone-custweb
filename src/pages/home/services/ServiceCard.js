import React, { PureComponent } from 'react';
import { func } from 'prop-types';
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
    onChange: func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      imgSrc: props.service.image && props.service.image.fileUrl
        ? props.service.image.fileUrl : serviceImg,
    };
  }

  onSelectService = () => {
    const { onChange, service } = this.props;
    onChange(service, 'selectedService');
  };

  onError = () => {
    this.setState({ imgSrc: serviceImg });
  };

  render() {
    const { service } = this.props;
    const { imgSrc } = this.state;
    return (
      <Card raised classes={{ root: styles.serviceCard }}>
        <CardMedia
          className={styles.image}
          image={imgSrc}
          onError={this.onError}
        />
        <CardContent className={styles.serviceContent}>
          <ServiceDetail service={service} />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={this.onSelectService}
            fullWidth
            className={styles.serviceAction}
          >
            Learn more
          </Button>
        </CardActions>
      </Card>
    );
  }
}
