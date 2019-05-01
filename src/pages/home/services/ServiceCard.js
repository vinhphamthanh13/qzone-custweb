import React, { PureComponent } from 'react';
import { func } from 'prop-types';
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
    const { onBooking, service } = this.props;
    onBooking(service);
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
            onBooking={this.handleBooking}
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
  onBooking: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.home,
});

export default connect(mapStateToProps)(ServiceCard);
