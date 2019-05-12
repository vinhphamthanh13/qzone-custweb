import React from 'react';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { history } from 'containers/App';
import s from './Maintenance.module.scss';

const Maintenance = () => (
  <div className={s.maintenance}>
    <div className={s.contents}>
      <div className={s.bgBox} />
      <div className={s.title}>
        <Typography variant="h2" className="text-bold main-color-04">
          Quezone is not reachable at the moment!
        </Typography>
      </div>
      <div className={s.body}>
        <Typography variant="h5" color="inherit" className="text-bold">
          We are sure this new upgrade will completely blow your mind!
        </Typography>
      </div>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => history.push('/')}
      >HOME
      </Button>
    </div>
  </div>
);

export default Maintenance;
