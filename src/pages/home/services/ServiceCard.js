import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import serviceImg from 'images/service-provider.png';
import {
  Card, CardContent, CardMedia,
  Typography, Tabs, Tab,
} from '@material-ui/core';
import './ServiceCard.scss';

export const serviceType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export default class ServiceCard extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    service: serviceType.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };
  }

  onChange = () => {
    const { onChange, service } = this.props;
    onChange(service, 'selectedService');
  }

  onTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  }

  render() {
    const { service } = this.props;
    const { selectedTab } = this.state;

    return (
      <Card>
        <div className="service-card__header">
          <CardMedia
            className="service-card__image"
            image={serviceImg}
          />
          <Tabs
            scrollable
            color="primary"
            value={selectedTab}
            onChange={this.onTabChange}
            classes={{ root: 'service-card__tab-root' }}
          >
            <Tab label="Services" />
            <Tab label="Organisation" />
          </Tabs>
        </div>
        <CardContent>
          {selectedTab === 0
            && (
              <Typography>
                {service.name}
              </Typography>
            )
          }
          {selectedTab === 1
            && (
              <Typography>
                Organisation
              </Typography>
            )
          }
        </CardContent>
      </Card>
    );
  }
}
