import React, { Component } from 'react';
import get from 'lodash/get';
import noop from 'lodash/noop';
import { PhoneIphone, Public } from '@material-ui/icons';
import { limitString, navigateTo } from 'utils/common';
import defaultImage from 'images/providers.jpg';
import { SLIDE_TYPE } from 'utils/constants';
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

  handleRedirect = ref => () => {
    navigateTo(`/organization/${ref}`)();
  };

  render() {
    const { item, type } = this.state;

    let name;
    let image;
    let website;
    let phone;
    let orgIntro;
    let orgName;
    let ref;
    let addStyle = '';
    let action = noop;
    if (type === SLIDE_TYPE.ORG) {
      name = get(item, 'name');
      image = get(item, 'advPic.fileUrl') || defaultImage;
      website = get(item, 'website');
      phone = get(item, 'telephone');
      orgIntro = get(item, 'description');
      ref = get(item, 'orgRef', '');
      addStyle = 'hover-pointer';
      action = this.handleRedirect;
    }
    if (type === SLIDE_TYPE.SER) {
      name = get(item, 'name');
      image = get(item, 'image.fileUrl') || defaultImage;
      orgIntro = get(item, 'description');
      orgName = get(item, 'organizationEntity.name');
      website = get(item, 'organizationEntity.website');
      phone = get(item, 'organizationEntity.telephone');
    }

    return (
      // eslint-disable-next-line
      <div className={`${s.wrapper} ${addStyle}`} onClick={action(ref)}>
        <div className={s.image}>
          <img src={image} alt={name} width="100%" />
        </div>
        <div className={s.content}>
          <div className={`${s.title} ellipsis`}>{name}</div>
          <div className={`${s.orgName} ellipsis`}>{orgName}</div>
          <div className={s.orgContact}>
            <div className={s.item}><PhoneIphone color="secondary" className="icon-small" />{phone}</div>
            <div className={s.item}>
              <Public color="secondary" className="icon-small" />
              <a href={website} target="_blank" rel="noopener noreferrer">&nbsp;{website}</a>
            </div>
          </div>
          <div className={s.orgIntro}>
            {limitString(orgIntro, 250)}
          </div>
        </div>
      </div>
    );
  }
}

export default Slide;
