import React, { Component } from 'react';
import Slider from 'react-slick';
import { get } from 'lodash';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import defaultImage from 'images/default-service-card.png';
import Slide from './Slide';
import s from './SlideShow.module.scss';

class SlideShow extends Component {
  state = {
    services: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { services } = props;
    const { services: cachedServices } = state;
    const updatedState = {};
    if (
      services !== null &&
      JSON.stringify(services) !== JSON.stringify(cachedServices)
    ) {
      updatedState.services = services;
    }

    return Object.keys(services) ? updatedState : null;
  }

  render() {
    const slideSettings = {
      infinite: true,
      lazyMode: true,
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      className: s.sliderControl,
    };
    const { services } = this.state;

    return (
      <div className={s.carousel}>
        <div className={s.title}>
          Available services
        </div>
        <div className={s.sliderWrapper}>
          <div className={s.advertisers} />
          {services ? (
            <div>
              <Slider {...slideSettings}>
                {services.map((service) => {
                  const serviceId = get(service, 'id');
                  const fileUrl = get(service, 'image.fileUrl', defaultImage);
                  const name = get(service, 'name');
                  const description = get(service, 'description');
                  const orgEntity = get(service, 'organizationEntity');
                  const orgId = get(orgEntity, 'id');
                  const orgName = get(orgEntity, 'name');
                  const linkedProvider = get(service, 'linkedProvider');

                  return (
                    <Slide
                      key={serviceId}
                      imageUrl={fileUrl}
                      name={name}
                      description={description}
                      orgId={orgId}
                      orgName={orgName}
                      disabledBooking={!linkedProvider || linkedProvider.length < 1}
                    />
                  );
                })}
              </Slider>
            </div>
          ) : <div className={s.advertisers} /> }
        </div>
      </div>
    );
  }
}

export default SlideShow;
