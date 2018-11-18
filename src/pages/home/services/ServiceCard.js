import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import serviceImg from 'images/service-provider.png';
import {
  Card, CardContent, CardMedia, CardActions,
  Typography, Tabs, Tab, Button, Paper, Grid,
} from '@material-ui/core';
import './ServiceCard.scss';
import CustomLink from 'components/CustomLink';
import { format } from 'date-fns';

export const serviceType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

const mockProviders = [
  {
    id: 1,
    name: 'Provider 1',
    availableSlots: ['06:00 PM', '07:00 PM', '07:40 PM', '07:50 PM'],
  },
  {
    id: 2,
    name: 'Provider 2',
    availableSlots: ['06:10 PM', '06:30 PM', '07:40 PM', '07:50 PM'],
  },
  {
    id: 3,
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
      selectedTime: { providerId: 1, time: '06:00 PM' },
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
              <div>
                <Typography variant="title">{service.name}</Typography>
                <div className="service-card__service-detail">
                  <div className="service-card__service-detail-item">
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="caption">Date:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="subtitle2">{format(selectedDate, 'dd MMM yyyy')}</Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="service-card__service-detail-item">
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="caption">Start at:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="subtitle2">{selectedTime.time}</Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="service-card__service-detail-item">
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="caption">Service provider:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="subtitle2">
                          {mockProviders.find(provider => provider.id === selectedTime.providerId).name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="service-card__service-detail-item">
                    <Grid container>
                      <Grid item sm={6}>
                        <Typography variant="caption">Organisation:</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant="subtitle2">
                          Organisation 1
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            )
          }
          {selectedTab === 1
            && (
              <Typography>
                Organisation
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo
                reprehenderit optio amet ab temporibus asperiores quasi cupiditate.
                Voluptatum ducimus voluptates voluptas?
                <CustomLink className="service-card__org-link" to="/organisation/1" text="Find out more" />
              </Typography>
            )
          }
          {selectedTab === 2
            && (
              mockProviders.map(provider => (
                <div key={provider.id} className="service-card__provider-time">
                  <Typography>{provider.name}</Typography>
                  <Grid container spacing={8}>
                    {provider.availableSlots.map(time => (
                      <Grid item sm={3} key={time}>
                        <Button
                          variant={selectedTime.providerId === provider.id && selectedTime.time === time
                            ? 'contained' : 'outlined'}
                          color="secondary"
                          onClick={() => { this.onSelectTime(provider.id, time); }}
                        >
                          {time}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ))
            )
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
