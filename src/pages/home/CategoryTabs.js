import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, IconButton,
  Menu, MenuItem, Tab, Tabs, Toolbar,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SimpleSearch from './SimpleSearch';
import './CategoryTabs.scss';

const serviceCategoryType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parentCategory: PropTypes.object,
});

export const serviceCategoriesType = PropTypes.arrayOf(serviceCategoryType);

export default function CategoryTabs({
  value, onSearch, onCategoryChange, serviceCategories, handleOpenMenu, handleCloseMenu, anchorEl,
}) {
  const isSmallScreen = window.innerWidth < 660;
  return (
    <AppBar position="static">
      <Toolbar>
        {isSmallScreen ? (
          <>
            <IconButton
              onClick={handleOpenMenu}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              classes={{ paper: 'category-tabs' }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              { serviceCategories.map(category => (category.parentCategoryId === null
                ? (
                  <MenuItem
                    classes={{ selected: 'category-tabs__active-menu-item' }}
                    value={category.id}
                    selected={value === category.id}
                    key={category.id}
                    onClick={($event) => {
                      handleCloseMenu();
                      onCategoryChange($event, category.id);
                    }}
                  >
                    {category.name}
                  </MenuItem>
                )
                : null))}
            </Menu>
          </>
        ) : (
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
        )}
        <div className="grow" />
        <SimpleSearch onSearch={onSearch} />
      </Toolbar>
    </AppBar>
  );
}

CategoryTabs.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onSearch: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  serviceCategories: serviceCategoriesType.isRequired,
  anchorEl: PropTypes.objectOf(PropTypes.object),
  handleOpenMenu: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
};

CategoryTabs.defaultProps = {
  anchorEl: null,
};
