import React, { Component } from 'react';
import {
  arrayOf, object, func, string,
} from 'prop-types';
import Slider from 'react-slick';
import { Typography } from '@material-ui/core';
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

  constructor(props) {
    super(props);
    this.state = {
      topServices: this.topTenServices(props.services),
    };
  }

  topTenServices = list => list.sort((item1, item2) => item2.rating - item1.rating).slice(0, 10);

  handleBooking = (service) => {
    const { onBooking } = this.props;
    onBooking(service, 'selectedService');
  };

  render() {
    const { topServices } = this.state;
    const slideSettings = {
      // dots: true,
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
        <div className="title">
          <Typography variant="headline" color="textSecondary">Trending</Typography>
        </div>
        <div className="slider-wrapper">
          <div className="advertisers" />
          <div>
            <Slider {...slideSettings}>
              {topServices.map(service => (
                <Slide
                  key={service.id}
                  imageUrl={service.image.fileUrl}
                  name={service.name}
                  description={service.description}
                  rating={service.rating}
                  reviews={service.viewNum}
                  onBooking={() => this.handleBooking(service)}
                  duration={service.duration}
                  orgId={service.organization.id}
                  orgName={service.organization.name}
                />
              ))}
            </Slider>
          </div>
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
