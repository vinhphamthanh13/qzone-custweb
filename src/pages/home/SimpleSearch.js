import React from 'react';
import { Input, Button } from '@material-ui/core';
import './SimpleSearch.scss';

export default function SimpleSearch({ onSubmit, onChange }) {
  return (
    <div className="simple-search">
      <Input
        autoFocus
        className="simple-search__input"
        type="search"
        placeholder="Search organisations, services or providers"
        onChange={(event) => { onChange(event.target.value, 'searchText'); }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSubmit}
      >
        {'Go'}
      </Button>
    </div>
  );
}
