import React from 'react';
import { Typography } from '@material-ui/core';
import CustomLink from 'components/CustomLink';
import './TabOrg.scss';

export default function TabOrg() {
  return (
    <React.Fragment>
      <Typography variant="title">Organisation name 1</Typography>
      <Typography className="tab-org__description">
        Organisation
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo
        reprehenderit optio amet ab temporibus asperiores quasi cupiditate.
        Voluptatum ducimus voluptates voluptas?
        <CustomLink className="tab-org__link" to="/organisation/1" text="Find out more" />
      </Typography>
    </React.Fragment>
  );
}
