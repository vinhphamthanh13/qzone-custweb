import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, IconButton, Button,
  Menu, MenuItem, Tab, Tabs, Toolbar,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SimpleSearch from './SimpleSearch';
import styles from './Header.module.scss';

const serviceCategoryType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  parentCategory: PropTypes.object,
});

export const serviceCategoriesType = PropTypes.arrayOf(serviceCategoryType);

export default function Header({
  value, onSearch, onCategoryChange, serviceCategories, handleOpenMenu, handleCloseMenu, menuIconButtonEl,
  openLogin, openSignup,
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
              classes={{ paper: styles.header }}
              anchorEl={menuIconButtonEl}
              open={Boolean(menuIconButtonEl)}
              onClose={handleCloseMenu}
            >
              { serviceCategories.map(category => (category.parentCategoryId === null
                ? (
                  <MenuItem
                    classes={{ selected: styles.activeMenuItem }}
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
            variant="scrollable"
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
        <Button color="inherit" onClick={openLogin}>Log in</Button>
        <Button color="inherit" onClick={openSignup}>Register</Button>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  onSearch: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  serviceCategories: serviceCategoriesType.isRequired,
  openLogin: PropTypes.func.isRequired,
  openSignup: PropTypes.func.isRequired,
  menuIconButtonEl: PropTypes.objectOf(PropTypes.object),
  handleOpenMenu: PropTypes.func.isRequired,
  handleCloseMenu: PropTypes.func.isRequired,
};

Header.defaultProps = {
  menuIconButtonEl: null,
};
