import React from 'react';
import {
  AppBar, Tabs, Tab, Toolbar,
} from '@material-ui/core';
import SimpleSearch from './SimpleSearch';
import 'styles/_layout.scss';

export default function CategoryTabs({
  value, onChange, onSubmit, onCategoryChange,
}) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Tabs
          value={value}
          onChange={onCategoryChange}
          scrollable
        >
          <Tab label="Category One" />
          <Tab label="Category Two" />
          <Tab label="Category Three" />
          <Tab label="Category Four" />
          <Tab label="Category Five" />
          <Tab label="Category Six" />
          <Tab label="Category Seven" />
        </Tabs>
        <div className="grow" />
        <SimpleSearch onChange={onChange} onSubmit={onSubmit} />
      </Toolbar>
    </AppBar>
  );
}
