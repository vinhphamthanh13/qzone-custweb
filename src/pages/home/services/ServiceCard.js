import React, { PureComponent } from 'react';
import serviceImg from 'images/service-provider.png';
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
    availableSlots: ['06:00 PM', '07:00 PM', '07:40 PM', '07:50 PM'],
  },
  {
    id: '2',
    name: 'Provider 2',
    availableSlots: ['06:10 PM', '06:30 PM', '07:40 PM', '07:50 PM'],
  },
  {
    id: '3',
    name: 'Provider 3',
    availableSlots: ['06:00 PM', '07:00 PM', '08:40 PM', '08:50 PM'],
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
            Book now
          </Button>
        </CardActions>
      </Card>
    );
  }
}
