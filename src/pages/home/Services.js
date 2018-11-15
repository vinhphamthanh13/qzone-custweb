import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import './Services.scss';
import AdvancedSearch from './AdvancedSearch';
import 'styles/_layout.scss';
import SubCategoryTabs, { subCategoriesType } from './SubCategoryTabs';
import ServiceCard, { serviceType } from './services/ServiceCard';

export default function Services({
  services,
  onChange,
  selectedSubCategoryId,
  subCategories,
}) {
  return (
    <React.Fragment>
      <Paper elevation={1} className="select-services__options">
        <SubCategoryTabs
          selectedSubCategoryId={selectedSubCategoryId}
          subCategories={subCategories}
          onChange={onChange}
        />
        <div className="grow" />
        <AdvancedSearch onChange={onChange} />
      </Paper>
      <Grid container spacing={32}>
        {services.map(service => (
          <Grid item md={4} key={service.id}>
            <ServiceCard onChange={onChange} service={service} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}

Services.propTypes = {
  services: PropTypes.arrayOf(serviceType).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedSubCategoryId: PropTypes.string,
  subCategories: subCategoriesType.isRequired,
};

Services.defaultProps = {
  selectedSubCategoryId: undefined,
};
