import React from 'react';
import {
  Button,
} from '@material-ui/core';
import './SubCategoryTabs.scss';

export default function SubCategoryTabs({
  subCategories, onChange, selectedSubCategory,
}) {
  return (
    subCategories.map(subCategory => (
      <Button
        key={subCategory.id}
        variant={selectedSubCategory && selectedSubCategory.id === subCategory.id
          ? 'contained' : 'flat'}
        color="primary"
        onClick={() => { onChange(subCategory, 'selectedSubCategory'); }}
        className="subcategory-tabs__item"
      >
        {subCategory.name}
      </Button>
    ))
  );
}
