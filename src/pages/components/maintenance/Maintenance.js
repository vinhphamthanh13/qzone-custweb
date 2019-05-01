import React from 'react';
import { Typography } from '@material-ui/core';
import s from './Maintenance.module.scss';

const Maintenance = () => (
  <div className={s.maintenance}>
    <div className={s.contents}>
      <div className={s.bgBox} />
      <div className={s.title}>
        <Typography variant="h2" className="text-bold malibu-color">
          Quezone is in under maintenance
        </Typography>
      </div>
      <div className={s.body}>
        <Typography variant="h5" color="inherit" className="text-bold">
          We are sure this new upgrade will completely blow your mind!
          Please sign up above to stay updated...
        </Typography>
      </div>
    </div>
  </div>
);

export default Maintenance;
