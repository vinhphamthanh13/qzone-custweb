import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const Brand = (props) => {
  const { organisationName, logo, brandClass } = props;
  return (
    <Grid item xs={12} sm={4} md={2}>
      <div className={brandClass.wrapper.root}>
        <Avatar classes={brandClass.logo} alt={organisationName} src={logo} />
        <Typography classes={brandClass.brand}>{organisationName}</Typography>
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
    wrapper: {
      root: 'brandWrapper',
    },
  },
};

export default Brand;
