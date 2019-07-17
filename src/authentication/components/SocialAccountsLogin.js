import React from 'react';
import { socialLoginType, classesType } from 'types/global';
import { noop } from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import CustomButton from 'components/CustomButton';
import { FACEBOOK_AUTH_URL } from '../actions/constants';
import s from './SocialAccountsLogin.style';

const accounts = ['twitter', 'google'];

const SocialAccountsLogin = (props) => {
  const { classes, actions } = props;
  return (
    <div className={classes.wrapper}>
      <CustomButton
        key="facebookredirect"
        justIcon
        onClick={noop}
        target="_blank"
        className={classes.button}
        color="transparent"
      >
        <a href={FACEBOOK_AUTH_URL}>
          <i className={`fab fa-facebook ${classes.icon} white-color`} />
        </a>
      </CustomButton>
      {accounts.map(account => (
        <CustomButton
          key={account}
          justIcon
          onClick={actions[account]}
          target="_blank"
          className={classes.button}
          color="transparent"
        >
          <i className={`fab fa-${account} ${classes.icon}`} />
        </CustomButton>
      ))}
    </div>
  );
};

SocialAccountsLogin.propTypes = {
  actions: socialLoginType,
  classes: classesType.isRequired,
};

SocialAccountsLogin.defaultProps = {
  actions: {
    facebook: () => {},
    google: () => {},
    twitter: () => {},
  },
};

export default withStyles(s)(SocialAccountsLogin);
