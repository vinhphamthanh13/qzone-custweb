import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';
import Slider from 'react-slick';
import { Typography } from '@material-ui/core';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slide from './Slide';

class SlideShow extends Component {
  static propTypes = {
    services: arrayOf(object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      topServices: this.topTenServices(props.services),
    };
  }

  topTenServices = list => list.sort((item1, item2) => item2.rating - item1.rating).slice(0, 10);

  render() {
    const { topServices } = this.state;
    const slideSettings = {
      dots: true,
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
          <Typography variant="headline" color="textSecondary">Top services</Typography>
        </div>
        <div className="slider-wrapper">
          <Slider {...slideSettings}>
            {topServices.map(service => (
              <Slide
                key={service.id}
                imageUrl={service.image.fileUrl}
                name={service.name}
                description={service.description}
                rating={service.rating}
                reviews={service.viewNum}
              />
            ))}
          </Slider>
        </div>
      </div>
    );
  }
}

export default SlideShow;
