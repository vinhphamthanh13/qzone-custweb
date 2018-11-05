import React from 'react';
import {
  Card, CardContent, CardHeader,
  Collapse, Grid, Avatar, Typography, CardActionArea,
  MenuList, MenuItem, Divider,
} from '@material-ui/core';
import './SelectServices.scss';

export default function SelectServices({
  onSelectSubCategory,
  categories,
  expandedCategories,
  handleExpandClick,
}) {
  return (
    <Grid container spacing={16}>
      {categories.map(category => (
        <Grid item md={3} key={category.id}>
          <Card>
            <CardActionArea onClick={() => handleExpandClick(category.id)}>
              <CardHeader
                avatar={(
                  <Avatar aria-label="Recipe" className="avatar">
                    {'R'}
                  </Avatar>
                )}
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
              <CardContent>
                <Typography component="p">
                  {category.name}
                </Typography>
              </CardContent>
            </CardActionArea>
            <Divider />
            <Collapse in={expandedCategories[category.id]} timeout="auto" unmountOnExit>
              <CardContent>
                <MenuList>
                  {category.subs.map((subCategory) => {
                    const renderItems = [];
                    if (subCategory.services.length > 0) {
                      renderItems.push(
                        <MenuItem
                          key={subCategory.id}
                          onClick={() => onSelectSubCategory(subCategory.name)}
                        >
                          {`- ${subCategory.name}`}
                        </MenuItem>,
                      );
                      subCategory.services.forEach((service) => {
                        renderItems.push(
                          <MenuItem
                            disabled
                            key={service.id}
                            className="select-services__service"
                          >
                            {`-- ${service.name}`}
                          </MenuItem>,
                        );
                      });
                    }
                    return renderItems;
                  })}
                </MenuList>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
