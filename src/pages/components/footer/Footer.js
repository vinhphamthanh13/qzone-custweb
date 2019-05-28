import React from 'react';
import { bool } from 'prop-types';
import { Typography, Icon } from '@material-ui/core';
import logo from 'images/quezone-logo.png';
import s from './Footer.module.scss';

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
  { name: 'twitter', icon: 'twitter' },
  { name: 'facebook', icon: 'facebook' },
  { name: 'instagram', icon: 'instagram' },
];

const Footer = props => (
  <div className={props.maintenance ? `${s.footer} ${s.footerMaintenance}` : s.footer}>
    <div className={s.info}>
      <div className={s.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          NEED HELP
        </Typography>
        {needHelp.map(item => (
          <Typography key={item} variant="body1" color="textSecondary" classes={{ body1: s.items }}>
            {item}
          </Typography>
        ))}
      </div>
      <div className={s.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          YOUR QUEUING
        </Typography>
        {yourQueuing.map(item => (
          <Typography key={item} variant="body1" color="textSecondary" classes={{ body1: s.items }}>
            {item}
          </Typography>
        ))}
      </div>
      <div className={s.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          ABOUT
        </Typography>
        {about.map(item => (
          <Typography key={item} variant="body1" color="textSecondary" classes={{ body1: s.items }}>
            {item}
          </Typography>
        ))}
      </div>
      <div className={s.infoDetail}>
        <Typography variant="subtitle1" color="primary">
          FOLLOW US
        </Typography>
        {following.map(item => (
          <div key={item.name} className="flex v-center">
            <Icon className={`fab fa-${item.icon} icon-main`} />
            <Typography variant="body1" color="textSecondary" classes={{ body1: s.items }}>
              {item.name}
            </Typography>
          </div>
        ))}
      </div>
    </div>
    <div className="copyright">
      <Typography variant="body1" color="textSecondary" classes={{ body1: 'copyText' }}>&#x24B8; 2019</Typography>
      <img src={logo} className={s.footerAvatar} alt="QZLogo" />
    </div>
  </div>
);

Footer.propTypes = {
  maintenance: bool.isRequired,
};

export default Footer;
