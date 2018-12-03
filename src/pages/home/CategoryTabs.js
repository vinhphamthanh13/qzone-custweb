import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Tabs, Tab, Toolbar,
} from '@material-ui/core';
import SimpleSearch from './SimpleSearch';
import 'styles/_layout.scss';

const serviceCategoryType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parentCategory: PropTypes.object,
});

export const serviceCategoriesType = PropTypes.arrayOf(serviceCategoryType);

export default function CategoryTabs({
  value, onChange, onSubmit, onCategoryChange, serviceCategories,
}) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Tabs
          value={value}
          onChange={onCategoryChange}
          scrollable={serviceCategories.length > 7}
        >
          {serviceCategories.map(category => (category.parentCategoryId === null
            ? (
              <Tab key={category.id} label={category.name} value={category.id} />
            )
            : null))}
        </Tabs>
        <div className="grow" />
        <SimpleSearch onChange={onChange} onSubmit={onSubmit} />
      </Toolbar>
    </AppBar>
  );
}

CategoryTabs.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  serviceCategories: serviceCategoriesType.isRequired,
};
