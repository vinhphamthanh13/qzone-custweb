import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import styles from './SubCategoryTabs.style';

const SubCategoryTabs = (props) => {
  const {
    subCategories, onChange, selectedSubCategoryId, classes,
  } = props;
  return subCategories.length
    ? (
      <>
        <Button variant="text" color="textPrimary">More services for you in </Button>
        { subCategories.map((subCategory) => {
          const tabClass = selectedSubCategoryId && selectedSubCategoryId === subCategory.id
            ? classes.activeItem : classes.item;
          return (
            <Button
              key={subCategory.id}
              variant="text"
              color="primary"
              disableRipple
              onClick={() => onChange(subCategory.id, 'selectedSubCategoryId')}
              className={`${tabClass} ${classes.textCapitalized}`}
            >
              {subCategory.name}
            </Button>);
        })
        }
      </>
    ) : (
      <Button
        variant="text"
        color="textPrimary"
        disableRipple
        className={classes.item}
      >
        Services for you
      </Button>
    );
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
