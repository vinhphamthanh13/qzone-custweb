import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './SubCategoryTabs.scss';

export default function SubCategoryTabs({
  subCategories, onChange, selectedSubCategory,
}) {
  return (
    subCategories.map(subCategory => (
      <Button
        key={subCategory.id}
        variant={selectedSubCategory && selectedSubCategory.id === subCategory.id
          ? 'contained' : 'text'}
        color="primary"
        onClick={() => { onChange(subCategory, 'selectedSubCategory'); }}
        className="subcategory-tabs__item"
      >
        {subCategory.name}
      </Button>
    ))
  );
}

export const subCategoryType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const subCategoriesType = PropTypes.arrayOf(subCategoryType);

SubCategoryTabs.propTypes = {
  subCategories: subCategoriesType.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedSubCategory: subCategoryType.isRequired,
};
