import React, { Component } from 'react';
import { func } from 'prop-types';
import { get } from 'lodash';
import defaultPImage from 'images/providers.jpg';
import { Email, PhoneIphone, Place } from '@material-ui/icons';
// import TemporaryService from 'pages/landing/TemporaryService';
import s from './Provider.module.scss';

class Provider extends Component {
  static propTypes = {
    dispatchAvailabilities: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    serviceId: '',
    providerId: '',
    locationId: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { provider } = props;
    const { provider: cachedProvider} = state;
    const updatedState = {};
    if (JSON.stringify(provider) !== JSON.stringify(cachedProvider)) {
      updatedState.provider = provider;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchAvailabilities } = this.props;
    const { provider } = this.state;
    const temporaryServiceIds = get(provider, 'temporaryServiceId');
    const providerId = get(provider, 'providerId');
    const serviceId = get(provider, 'serviceId');
    const locationId = get(provider, 'geoLocation.id');
    this.setState({
      serviceId,
      providerId,
      locationId,
    });
    dispatchAvailabilities(temporaryServiceIds, serviceId, providerId, locationId);
  }

  render() {
    const { provider, serviceId, providerId, locationId } = this.state;
    const pName = get(provider, 'givenName');
    const pEmail = get(provider, 'email');
    const pPhone = get(provider, 'telephone');
    const pImage = get(provider, 'imageUrl') || defaultPImage;
    const pAddress = get(provider, 'geoLocation.fullAddress');
    console.log('serviceId', serviceId);
    console.log('locationId', locationId);

    return (
      <div key={providerId} className={s.card}>
        <div className={s.image}>
          <img src={pImage} alt="QProvider" />
        </div>
        <div className={s.content}>
          <div className={s.name}>
            {pName}
          </div>
          <div className={s.item}>
            <PhoneIphone className="icon-small" color="inherit" />
            <span>&nbsp;{pPhone}</span>
          </div>
          <div className={s.item}>
            <Email className="icon-small" color="inherit" />
            <span>&nbsp;{pEmail}</span>
          </div>
          <div className={s.place}>
            <div className={s.item}>
              <Place className="icon-small" color="secondary" />
              <span>&nbsp;{pAddress}</span>
            </div>
          </div>
        </div>
        <div className={s.availabilities}>
          {/* <TemporaryService serviceId={serviceId} providerId={providerId} locationId={locationId} /> */}
        </div>
      </div>
    );
  }
}

export default Provider;
