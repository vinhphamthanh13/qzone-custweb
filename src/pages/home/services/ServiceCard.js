import React, { PureComponent } from 'react';
import serviceImg from 'images/service-provider.jpeg';
import {
  Card, CardContent, CardMedia, CardActions,
  Button,
} from '@material-ui/core';
import './ServiceCard.scss';
import { serviceType } from 'types/global';
import ServiceDetail from './serviceCard/ServiceDetail';

const mockProviders = [
  {
    id: '1',
    name: 'Provider 1',
    availableSlots: [],
  },
  {
    id: '2',
    name: 'Provider 2',
    availableSlots: [],
  },
  {
    id: '3',
    name: 'Provider 3',
    availableSlots: [],
  },
];

export default class ServiceCard extends PureComponent {
  static propTypes = {
    service: serviceType.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedTime: { providerId: '1', time: '06:00 PM' },
      selectedDate: new Date(),
    };
  }

  onSelectTime = (providerId, time) => {
    this.setState({ selectedTime: { providerId, time } });
  }

  render() {
    const { service } = this.props;
    const { selectedTime, selectedDate } = this.state;

    return (
      <Card>
        <CardMedia
          className="service-card__image"
          image={serviceImg}
        />
        <CardContent>
          <ServiceDetail
            providers={mockProviders}
            service={service}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={this.onSelectTime}
          />
        </CardContent>
        <CardActions classes={{ root: 'service-card__footer' }}>
          <Button color="primary" variant="contained" onClick={() => { }}>
            Select
          </Button>
        </CardActions>
      </Card>
    );
  }
}
