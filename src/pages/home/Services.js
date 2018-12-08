import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, CircularProgress } from '@material-ui/core';
import { serviceType } from 'types/global';
import './Services.scss';
import AdvancedSearch from './AdvancedSearch';
import 'styles/_layout.scss';
import SubCategoryTabs, { subCategoriesType } from './SubCategoryTabs';
import ServiceCard from './services/ServiceCard';
import EmptyState from './services/EmptyState';

export default function Services({
  services,
  onChange,
  selectedSubCategoryId,
  subCategories,
  isLoading,
  onLoadServices,
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
      <Grid container spacing={32} className="select-services__cards-wrapper">
        {
          isLoading && services.length === 0
          && <CircularProgress size={50} classes={{ root: 'select-services__loading' }} />
        }
        {
          !isLoading && services.length === 0
          && <EmptyState onLoadServices={onLoadServices} />
        }
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
  isLoading: PropTypes.bool.isRequired,
  onLoadServices: PropTypes.func.isRequired,
};

Services.defaultProps = {
  selectedSubCategoryId: undefined,
};
