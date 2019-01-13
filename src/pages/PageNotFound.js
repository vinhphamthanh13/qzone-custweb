import React from 'react';
import './PageNotFound.scss';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';


function PageNotFound() {
  return (
    <div className="notfound__wrapper">
      <div className="notfound__inner">
        <div className="notfound__content">
          <Typography variant="h1">Oops!</Typography>
          <Typography variant="h2">
                      404 - The Page can not be found
          </Typography>
        </div>
        <Link to="/">
            Go To Homepage
        </Link>
      </div>
      <div className="notfound__effect">
        <div className="cloud">
          <div className="cloud_left" />
          <div className="cloud_right" />
        </div>
        <div className="rain">
          <div className="drop" />
          <div className="drop" />
          <div className="drop" />
          <div className="drop" />
          <div className="drop" />
        </div>
        <div className="surface">
          <div className="hit" />
          <div className="hit" />
          <div className="hit" />
          <div className="hit" />
          <div className="hit" />
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
