import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const Brand = (props) => {
  const { organisationName, logo, brandClass } = props;
  return (
    <Grid item xs={6} md={2}>
      <div className="organisation-page__logo-wrapper">
        <Avatar
          classes={brandClass.logo}
          alt={organisationName}
          src={logo}
        />
        <Typography
          classes={brandClass.brand}
        >
          {organisationName}
        </Typography>
      </div>
    </Grid>
  );
};

Brand.propTypes = {
  organisationName: PropTypes.string,
  logo: PropTypes.string,
  brandClass: PropTypes.objectOf(PropTypes.object),
};

Brand.defaultProps = {
  organisationName: 'Quezone',
  logo: 'null',
  brandClass: {
    logo: {
      root: 'logo',
    },
    brand: {
      root: 'brand',
    },
  },
};

export default Brand;
