import React, { Component } from 'react';
import { get } from 'lodash';
import { PhoneIphone, Public } from '@material-ui/icons';
import { limitString } from 'utils/common';
import defaultLogo from 'images/logo.png';
import s from './Slide.module.scss';

class Slide extends Component {
  state = {
    item: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { item } = props;
    const { item: cachedItem } = state;
    const updatedState = {};
    if (
      item !== null &&
      JSON.stringify(item) !== JSON.stringify(cachedItem)
    ) {
      updatedState.item = item;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  render() {
    const { item } = this.state;
    const name = get(item, 'name');
    const image = get(item, 'logo.fileUrl') || defaultLogo;
    const website = get(item, 'website');
    const phone = get(item, 'telephone');
    const orgIntro = get(item, 'description');

    return (
      <div className={s.wrapper}>
        <div className={s.image}>
          <img src={image} alt={name} width="100%" />
        </div>
        <div className={s.content}>
          <div className={`${s.title} ellipsis`}>{name}</div>
          <div className={s.orgContact}>
            <div className={s.item}><PhoneIphone color="secondary" className="icon-small" />{phone}</div>
            <div className={s.item}>
              <Public color="secondary" className="icon-small" />
              <a href={website} target="_blank" rel="noopener noreferrer">&nbsp;{website}</a>
            </div>
          </div>
          <div className={s.orgIntro}>
            {limitString(orgIntro, 350)}
          </div>
        </div>
      </div>
    );
  }
}

export default Slide;
