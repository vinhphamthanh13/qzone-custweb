import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import { serviceType } from 'types/global';
import styles from './Services.module.scss';
import SubCategoryTabs, { subCategoriesType } from './SubCategoryTabs';
import ServiceCard from './services/ServiceCard';
import EmptyItem from './services/EmptyItem';

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
      <Paper elevation={1} className={styles.options}>
        <SubCategoryTabs
          selectedSubCategoryId={selectedSubCategoryId}
          subCategories={subCategories}
          onChange={onChange}
        />
      </Paper>
      <Grid container spacing={32} className={styles.cardsWrapper}>
        {
          !isLoading && services.length === 0
          && <EmptyItem onLoadServices={onLoadServices} />
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
