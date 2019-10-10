import React, { Component } from 'react';
import { get } from 'lodash';
import { PhoneIphone, Public } from '@material-ui/icons';
import { limitString } from 'utils/common';
import defaultLogo from 'images/logo.png';
import s from './Slide.module.scss';

class Slide extends Component {
  state = {
    item: {},
    type: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { item, type } = props;
    const { item: cachedItem, type: cachedType } = state;
    const updatedState = {};
    if (
      item !== null &&
      JSON.stringify(item) !== JSON.stringify(cachedItem)
    ) {
      updatedState.item = item;
    }
    if (type !== cachedType) {
      updatedState.type = type;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  render() {
    const { item, type } = this.state;

    let name;
    let image;
    let website;
    let phone;
    let orgIntro;
    if (type === 'organization') {
      name = get(item, 'name');
      image = get(item, 'logo.fileUrl') || defaultLogo;
      website = get(item, 'website');
      phone = get(item, 'telephone');
      orgIntro = get(item, 'description');
    }

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
