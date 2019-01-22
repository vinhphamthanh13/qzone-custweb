import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styles from './SimpleSearch.module.scss';

export default function SimpleSearch({ onSearch }) {
  return (
    <div className={styles.simpleSearch}>
      <div className={styles.icon}>
        <SearchIcon />
      </div>
      <Input
        placeholder="Services, organisations ..."
        classes={{ input: styles.input, root: styles.inputRoot }}
        onKeyUp={onSearch}
      />
    </div>
  );
}

SimpleSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
