import React from 'react';
import { func, string } from 'prop-types';
import { Typography, TextField } from '@material-ui/core';

const Search = (props) => {
  const { onSearch, onSearchValue } = props;
  return (
    <div>
      <Typography variant="subheading" color="primary">
        Advanced Search
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        onChange={onSearch}
        value={onSearchValue}
        placeholder="E.g, search by location"
      />
    </div>
  );
};

Search.propTypes = {
  onSearch: func.isRequired,
  onSearchValue: string,
};

Search.defaultProps = {
  onSearchValue: '',
};

export default Search;
