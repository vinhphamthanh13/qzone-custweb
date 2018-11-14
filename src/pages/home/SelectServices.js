import React from 'react';
import {
  Card, CardContent, CardMedia,
  Grid, Typography, CardActionArea,
  Paper,
} from '@material-ui/core';
import './SelectServices.scss';
import serviceImg from 'images/service-provider.png';
import AdvancedSearch from './AdvancedSearch';
import 'styles/_layout.scss';
import SubCategoryTabs from './SubCategoryTabs';

export default function SelectServices({
  services,
  onChange,
  selectedSubCategory,
  subCategories,
}) {
  return (
    <React.Fragment>
      <Paper elevation={1} className="select-services__options">
        <SubCategoryTabs
          selectedSubCategory={selectedSubCategory}
          subCategories={subCategories}
          onChange={onChange}
        />
        <div className="grow" />
        <AdvancedSearch onChange={onChange} />
      </Paper>
      <Grid container spacing={32}>
        {services.map(service => (
          <Grid item sm={3} key={service.id}>
            <Card>
              <CardActionArea onClick={() => onChange(service, 'selectedService')}>
                <CardMedia
                  className="select-services__item-image"
                  image={serviceImg}
                />
                <CardContent>
                  <Typography component="p">
                    {service.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
