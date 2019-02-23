import React from 'react';
import {
  func, string, bool, arrayOf,
} from 'prop-types';
import {
  Grid,
  // Paper,
} from '@material-ui/core';
import { serviceType } from 'types/global';
import EmptyItem from 'components/EmptyItem';
import styles from './Services.module.scss';
// import { subCategoriesType } from './SubCategoryTabs';
import ServiceCard from './services/ServiceCard';

export default function Services({
  services,
  onChange,
  // selectedSubCategoryId,
  // subCategories,
  isLoading,
  onLoadServices,
}) {
  return (
    <>
      { /*
      <Paper elevation={1} className={styles.options}>
        <SubCategoryTabs
          selectedSubCategoryId={selectedSubCategoryId}
          subCategories={subCategories}
          onChange={onChange}
        />
      </Paper>
      */ }
      <Grid container className={styles.cardsWrapper}>
        {
          !isLoading && services.length === 0
          && <EmptyItem onLoadServices={onLoadServices} />
        }
        {services.map(service => (
          <Grid item xs={6} md={3} key={service.id}>
            <ServiceCard onChange={onChange} service={service} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

Services.propTypes = {
  services: arrayOf(serviceType).isRequired,
  onChange: func.isRequired,
  selectedSubCategoryId: string,
  // subCategories: subCategoriesType.isRequired,
  isLoading: bool.isRequired,
  onLoadServices: func.isRequired,
};

Services.defaultProps = {
  selectedSubCategoryId: undefined,
};
