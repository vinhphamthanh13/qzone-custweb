import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import './SubCategoryTabs.scss';

export default function SubCategoryTabs({
  subCategories, onChange, selectedSubCategoryId,
}) {
  return (
    subCategories.map(subCategory => (
      <Button
        key={subCategory.id}
        variant={selectedSubCategoryId && selectedSubCategoryId === subCategory.id
          ? 'contained' : 'text'}
        color="primary"
        onClick={() => { onChange(subCategory.id, 'selectedSubCategoryId'); }}
        classes={{ root: 'subcategory-tabs__item' }}
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
  selectedSubCategoryId: PropTypes.string,
};
