import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import styles from './SubCategoryTabs.module.scss';

export default function SubCategoryTabs({
  subCategories, onChange, selectedSubCategoryId,
}) {
  const displaySubCategory = subCategories.length
    ? subCategories.map(subCategory => (
      <Button
        key={subCategory.id}
        variant={selectedSubCategoryId && selectedSubCategoryId === subCategory.id
          ? 'contained' : 'text'}
        color="main"
        onClick={() => onChange(subCategory.id, 'selectedSubCategoryId')}
        classes={{ root: styles.item }}
      >
        {subCategory.name}
      </Button>
    )) : <Button disabled>Services for you</Button>;
  return displaySubCategory;
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
