import React from 'react';
import { socialLoginType, classesType } from 'types/global';
import withStyles from '@material-ui/core/styles/withStyles';
import CustomButton from 'components/CustomButton';
import s from './SocialAccountsLogin.style';

const accounts = ['twitter', 'facebook', 'google'];

const SocialAccountsLogin = (props) => {
  const { classes, actions } = props;
  return (
    <div className={classes.wrapper}>
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
    'google-plus-g': () => {},
    twitter: () => {},
  },
};

export default withStyles(s)(SocialAccountsLogin);
