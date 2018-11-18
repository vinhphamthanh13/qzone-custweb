import React, { PureComponent } from 'react';
import serviceImg from 'images/service-provider.png';
import {
  Card, CardContent, CardMedia, CardActions,
  Tabs, Tab, Button, Paper,
} from '@material-ui/core';
import './ServiceCard.scss';
import { serviceType } from 'types/global';
import TabService from './serviceCard/TabService';
import TabOrg from './serviceCard/TabOrg';
import TabProviders from './serviceCard/TabProviders';

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
      selectedTab: 0,
      selectedTime: { providerId: '1', time: '06:00 PM' },
      selectedDate: new Date(),
    };
  }

  onTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  }

  onSelectTime = (providerId, time) => {
    this.setState({ selectedTime: { providerId, time } });
  }

  render() {
    const { service } = this.props;
    const { selectedTab, selectedTime, selectedDate } = this.state;

    return (
      <Card>
        <div className="service-card__header">
          <CardMedia
            className="service-card__image"
            image={serviceImg}
          />
          <Paper square classes={{ root: 'service-card__discount' }}>-30%</Paper>
        </div>
        <Tabs
          color="primary"
          value={selectedTab}
          onChange={this.onTabChange}
        >
          <Tab label="Service" />
          <Tab label="Organisation" />
          <Tab label="Providers" />
        </Tabs>
        <CardContent>
          {selectedTab === 0
            && (
              <TabService
                providers={mockProviders}
                service={service}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />)
          }
          {selectedTab === 1
            && (<TabOrg />)
          }
          {selectedTab === 2
            && (
            <TabProviders
              providers={mockProviders}
              selectedTime={selectedTime}
              onSelectTime={this.onSelectTime}
            />)
          }
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
