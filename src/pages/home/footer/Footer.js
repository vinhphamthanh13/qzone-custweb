import React from 'react';
import { Typography } from '@material-ui/core';
import style from './Footer.module.scss';

const Footer = () => (
  <div className={style.footer}>
    <Typography variant="subheading" color="secondary">
      This is footer of Quezone with
    </Typography>
  </div>
);

export default Footer;
