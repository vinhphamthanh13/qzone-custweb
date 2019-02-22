import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import styles from './SubCategoryTabs.style';

const SubCategoryTabs = (props) => {
  const {
    subCategories, onChange, selectedSubCategoryId, classes,
  } = props;
  const subCategoryLabel = (
    <Button
      variant="text"
      disableRipple
      className={
        `${classes.hoverTransparent} ${classes.textCapitalized} ${classes.mainColor} ${classes.unsetPointer}`}
    >
      { subCategories.length ? 'More services for you in' : 'Services for you' }
    </Button>);
  console.log('whre this the sub tab label');
  return subCategories.length
    ? (
      <>
        {subCategoryLabel}
        { subCategories.map((subCategory) => {
          const tabClass = selectedSubCategoryId && selectedSubCategoryId === subCategory.id
            ? classes.activeItem : classes.item;
          return (
            <Button
              key={subCategory.id}
              variant="text"
              disableRipple
              onClick={() => onChange(subCategory.id, 'selectedSubCategoryId')}
              className={
                `${tabClass} ${classes.textCapitalized} ${classes.unsetPointer}`}
            >
              {subCategory.name}
            </Button>);
        })
        }
      </>
    ) : subCategoryLabel;
};

export const subCategoryType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const subCategoriesType = PropTypes.arrayOf(subCategoryType);

SubCategoryTabs.propTypes = {
  subCategories: subCategoriesType.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedSubCategoryId: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

SubCategoryTabs.defaultProps = {
  selectedSubCategoryId: '',
};

export default withStyles(styles)(SubCategoryTabs);
