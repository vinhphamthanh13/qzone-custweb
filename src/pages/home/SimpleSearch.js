import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './SimpleSearch.scss';

export default function SimpleSearch({ onChange }) {
  return (
    <div className="simple-search">
      <div className="simple-search__icon">
        <SearchIcon />
      </div>
      <Input
        type="search"
        placeholder="Services, organisations ..."
        classes={{ input: 'simple-search__input', root: 'simple-search__input-root' }}
        onChange={(event) => { onChange(event.target.value, 'searchText'); }}
      />
    </div>
  );
}

SimpleSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
};
