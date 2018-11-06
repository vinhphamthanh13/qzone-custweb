import React from 'react';
import {
  Button, Grid, Paper,
} from '@material-ui/core';
import './SubCategoryTabs.scss';

export default function SubCategoryTabs({
  subCategories, onChange, selectedSubCategory,
}) {
  return (
    <Paper square className="subcategory-tabs">
      <Grid container>
        {subCategories.map(subCategory => (
          <Grid
            item
            key={subCategory.id}
            md={2}
            className="subcategory-tabs__item-wrapper"
          >
            <Button
              variant={selectedSubCategory && selectedSubCategory.id === subCategory.id
                ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => { onChange(subCategory, 'selectedSubCategory'); }}
              className="subcategory-tabs__item"
            >
              {subCategory.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
