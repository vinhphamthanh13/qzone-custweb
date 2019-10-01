import React, { Component } from 'react';
import Slider from 'react-slick';
import { get } from 'lodash';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slide from './Slide';
import s from './SlideShow.module.scss';

class SlideShow extends Component {
  state = {
    list: [],
  };

  static getDerivedStateFromProps(props, state) {
    const { list } = props;
    const { list: cachedList } = state;
    const updatedState = {};
    if (
      list !== null &&
      JSON.stringify(list) !== JSON.stringify(cachedList)
    ) {
      updatedState.list = list;
    }

    return Object.keys(updatedState) ? updatedState : null;
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
    const { list } = this.state;

    return (
      <div className={s.carousel}>
        <div className={s.title}>
          Our Organizations
        </div>
        <div className={s.sliderWrapper}>
          <div className={s.advertisers} />
          {list ? (
            <div>
              <Slider {...slideSettings}>
                {list.map((item) => {
                  const id = get(item, 'id');
                  return (
                    <Slide key={id} item={item} />
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
