import React, { Component } from 'react';
import Slider from 'react-slick';
import { get } from 'lodash';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import EmptyItem from 'components/EmptyItem';
import { SLIDE_TYPE } from 'utils/constants';
import Slide from './Slide';
import s from './SlideShow.module.scss';

class SlideShow extends Component {
  state = {
    list: [],
    type: SLIDE_TYPE.ORG,
  };

  static getDerivedStateFromProps(props, state) {
    const { list, type } = props;
    const { list: cachedList, type: cachedType } = state;
    const updatedState = {};
    if (
      list !== null &&
      JSON.stringify(list) !== JSON.stringify(cachedList)
    ) {
      updatedState.list = list;
    }
    if (
      type !== null &&
      JSON.stringify(type) !== JSON.stringify(cachedType)
    ) {
      updatedState.type = type;
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
    const { list, type } = this.state;
    const [heading, emptyMessage] = type === SLIDE_TYPE.ORG
      ? ['Our Organizations', 'No Organization Available'] : ['Our Services', 'No Services Available'];

    return (
      <div className={s.carousel}>
        {list.length > 0 ? (
          <>
            <div className={s.title}>
              {heading}
            </div>
            <div className={s.sliderWrapper}>
              <div>
                <Slider {...slideSettings}>
                  {list.map((item) => {
                    const id = get(item, 'id');
                    return (
                      <Slide key={id} item={item} type={type} />
                    );
                  })}
                </Slider>
              </div>
            </div>
          </>
        ) : <EmptyItem size="lg" message={emptyMessage} />}
      </div>
    );
  }
}

export default SlideShow;
