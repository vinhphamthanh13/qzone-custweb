import React, { Component } from 'react';
// import { arrayOf, object } from 'prop-types';
// import { AutoRotatingCarousel } from 'material-auto-rotating-carousel/src';
// import { Slide } from 'material-auto-rotating-carousel';

class SlideShow extends Component {
  state = {
    slide: false,
  };

  handleClose = () => {
    this.setState({ openSlide: false });
  };

  handleOpen = () => {
    this.setState({ openSlide: true });
  };


  render() {
    const { slide, openSlide } = this.state;
    return (
      <>
        <div
          label="testing"
          open={openSlide}
        >
          <div
            media={<div>ABC</div>}
            mediaBackgroundStyle={{ backgroundColor: 'blue' }}
            style={{ backgroundColor: 'blue' }}
            title="Ever wanted to be popular?"
            subtitle="Well just mix two colors and your are good to go!"
          />
          {slide}
          <div>TEst 1</div>
          <div>TEst 1</div>
          <div>TEst 1</div>
          <div>TEst 1</div>
          <div>TEst 1</div>
        </div>
      </>
    );
  }
}

export default SlideShow;
