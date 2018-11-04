import React from 'react';
import { Input, Button } from '@material-ui/core';
import './SimpleSearch.scss';

export default function SimpleSearch({ onSimpleSearch }) {
  return (
    <div className="simple-search">
      <Input
        autoFocus
        className="simple-search__input"
        type="search"
        placeholder="Organisations, services or providers"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSimpleSearch}
      >
        {'Search'}
      </Button>
    </div>
  );
}
