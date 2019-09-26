import React, { Component } from 'react';
import { Domain } from '@material-ui/icons';
import { limitString, navigateTo } from 'utils/common';
import { READ_MORE_MAX } from 'utils/constants';
import s from './Slide.module.scss';

class Slide extends Component {
  state = {
    imageUrl: '',
    name: '',
    description: '',
    orgName: '',
    orgId: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { imageUrl, name, description, orgName, orgId } = props;
    const {
      imageUrl: cachedImage, name: cachedName, description: cachedDescription,
      orgName: cachedOrgName, orgId: cachedOrgId,
    } = state;
    const updatedState = {};
    if (imageUrl !== cachedImage) {
      updatedState.imageUrl = imageUrl;
    }
    if (name !== cachedName) {
      updatedState.name = name;
    }
    if (description !== cachedDescription) {
      updatedState.description = description;
    }
    if (orgName !== cachedOrgName) {
      updatedState.orgName = orgName;
    }
    if (orgId !== cachedOrgId) {
      updatedState.orgId = orgId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  handleRedirectOrg = () => {
    const { orgId } = this.state;
    navigateTo(`/organization/${orgId}`)();
  };

  render() {
    const {
      imageUrl,
      name,
      description,
      orgName,
    } = this.state;

    return (
      <div className={s.wrapper}>
        <div className={s.image}>
          <img src={imageUrl} alt={name} width="100%" height="100%" />
        </div>
        <div className={s.content}>
          <div className={`${s.title} ellipsis`}>{name}</div>
          <div className={s.description}>
            {limitString(description, READ_MORE_MAX)}
          </div>
          {/* eslint-disable-next-line */}
          <div className="flex" onClick={this.handleRedirectOrg}>
            <Domain className="icon-small" color="inherit" />
            <span className={s.orgName}>&nbsp;{orgName}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Slide;
