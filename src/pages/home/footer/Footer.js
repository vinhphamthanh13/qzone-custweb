import React from 'react';
import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/es/Avatar/Avatar';
import logo from 'images/quezone-logo.png';
import style from './Footer.module.scss';

const needHelp = [
  'help', 'legal information', 'privacy policy', 'delivery information', 'business area',
];

const yourQueuing = [
  'swap your booking', 'online booking', 'tracking your queue',
];

const about = [
  'who we are?', 'to become a partner', 'our partner service',
];

const following = [
  'twitter', 'facebook', 'instagram',
];

const Footer = () => (
  <div className={style.footer}>
    <div className={style.info}>
      <div className={style.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          NEED HELP
        </Typography>
        {needHelp.map(item => (
          <Typography variant="body1" color="textSecondary" classes={{ body1: style.items }}>
            {item}
          </Typography>
        ))}
      </div>
      <div className={style.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          YOUR QUEUING
        </Typography>
        {yourQueuing.map(item => (
          <Typography variant="body1" color="textSecondary" classes={{ body1: style.items }}>
            {item}
          </Typography>
        ))}
      </div>
      <div className={style.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          ABOUT
        </Typography>
        {about.map(item => (
          <Typography variant="body1" color="textSecondary" classes={{ body1: style.items }}>
            {item}
          </Typography>
        ))}
      </div>
      <div className={style.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          FOLLOW US
        </Typography>
        {following.map(item => (
          <Typography variant="body1" color="textSecondary" classes={{ body1: style.items }}>
            {item}
          </Typography>
        ))}
      </div>
    </div>
    <div className={style.copyright}>
      <Typography variant="body1" color="textSecondary" classes={{ body1: style.copyText }}>&#x24B8; 2019</Typography>
      <Avatar src={logo} classes={{ root: style.footerAvatar }} imgProps={{ className: style.smallAvatar }} />
    </div>
  </div>
);

export default Footer;
