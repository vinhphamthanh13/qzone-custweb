import React, { Component } from 'react';
import {
  arrayOf, object, func, string,
} from 'prop-types';
import Slider from 'react-slick';
import { Typography } from '@material-ui/core';
import { get } from 'lodash';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slide from './Slide';

class SlideShow extends Component {
  static propTypes = {
    services: arrayOf(object).isRequired,
    onBooking: func.isRequired,
    onSearch: func.isRequired,
    onSearchValue: string,
  };

  static defaultProps = {
    onSearchValue: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { services } = props;
    const { services: cachedServices } = state;
    if (services !== cachedServices) {
      return { topServices: services };
    }
    return null;
  }

  state = {
    topServices: null,
  };

  topTenServices = list => list.sort((item1, item2) => item2.rating - item1.rating).slice(0, 10);

  handleBooking = (service) => {
    const { onBooking } = this.props;
    onBooking(service, 'selectedService');
  };

  render() {
    const { topServices } = this.state;
    const slideSettings = {
      infinite: true,
      lazyMode: true,
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      className: 'slider-control',
    };

    return (
      <div className="service-carousel">
        <div>
          <Typography className="title" variant="headline" color="textSecondary">Trending</Typography>
        </div>
        <div className="slider-wrapper">
          <div className="advertisers" />
          {topServices ? (
            <div>
              <Slider {...slideSettings}>
                {topServices.map((service) => {
                  const id = get(service, 'id');
                  const fileUrl = get(service, 'image.fileUrl');
                  const name = get(service, 'name');
                  const description = get(service, 'description');
                  const rating = get(service, 'rating');
                  const viewNum = get(service, 'viewNum');
                  const orgEntity = get(service, 'organizationEntity');
                  const orgId = get(orgEntity, 'id');
                  const orgName = get(orgEntity, 'name');
                  const linkedProvider = get(service, 'linkedProvider');

                  return (
                    <Slide
                      key={id}
                      imageUrl={fileUrl}
                      name={name}
                      description={description}
                      rating={rating}
                      reviews={viewNum}
                      onBooking={() => this.handleBooking(service)}
                      orgId={orgId}
                      orgName={orgName}
                      disabledBooking={!linkedProvider || linkedProvider.length < 1}
                    />
                  );
                })}
              </Slider>
            </div>
          ) : <div className="advertisers" /> }
          <div className="advertisers">
            <Typography variant="subheading" color="textSecondary">
            For advertisement. Contact us at Quezone.com.au or
            Hotline: +61 222 33 44 444
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default SlideShow;
