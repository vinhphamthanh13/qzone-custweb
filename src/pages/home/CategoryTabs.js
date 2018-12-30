import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Tab, Tabs, Toolbar, Button, MenuItem, Menu,
} from '@material-ui/core';
import SimpleSearch from './SimpleSearch';

const serviceCategoryType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parentCategory: PropTypes.object,
});

export const serviceCategoriesType = PropTypes.arrayOf(serviceCategoryType);

export default function CategoryTabs({
  value, onSearch, onCategoryChange, serviceCategories,
}) {
  const isSmallScreen = window.innerWidth < 660;
  return (
    <AppBar position="static">
      {isSmallScreen ? (
        <div>
          <Button
            aria-owns="simple-menu"
            aria-haspopup="true"
            onClick={() => { console.log(111); }}
          >
            Open Menu
          </Button>
          <Menu
            value={value}
            onChange={onCategoryChange}
            open={false}
            id="simple-menu"
          >
            {serviceCategories.map(category => (category.parentCategoryId === null
              ? (
                <MenuItem key={category.id}>{category.name}</MenuItem>
              )
              : null))}
          </Menu>
        </div>
      ) : (
        <Toolbar>
          <Tabs
            value={value}
            onChange={onCategoryChange}
            scrollable
          >
            {serviceCategories.map(category => (category.parentCategoryId === null
              ? (
                <Tab key={category.id} label={category.name} value={category.id} />
              )
              : null))}
          </Tabs>
          <div className="grow" />
          <SimpleSearch onSearch={onSearch} />
        </Toolbar>
      )}
    </AppBar>
  );
}

CategoryTabs.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onSearch: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  serviceCategories: serviceCategoriesType.isRequired,
};
