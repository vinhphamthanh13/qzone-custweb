import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';
import Slider from 'react-slick';
import { Typography } from '@material-ui/core';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class SlideShow extends Component {
  static propTypes = {
    services: arrayOf(object).isRequired,
  };

  state = {
    topServices: 5,
  };

  componentDidMount() {
    const { services } = this.props;
    this.setState({ topServices: this.topTenServices(services) });
  }

  handleClose = () => {
    this.setState({ openSlide: false });
  };

  handleOpen = () => {
    this.setState({ openSlide: true });
  };

  topTenServices = list => list.sort((item1, item2) => item2.rating - item1.rating).slice(0, 10);

  render() {
    const { slide, topServices, openSlide } = this.state;
    console.log('slide and openSlide', slide, topServices, openSlide);
    const slideSettings = {
      dots: false,
      infinite: true,
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: true,
    };

    return (
      <div className="service-carousel">
        <Typography variant="headline" color="textSecondary">Top services</Typography>
        <Slider {...slideSettings}>
          <div>TEst 1</div>
          <div>TEst 1</div>
          <div>TEst 1</div>
          <div>TEst 1</div>
          <div>TEst 1</div>
        </Slider>
      </div>
    );
  }
}

export default SlideShow;
