import React from 'react';
import {
  Card, CardContent, CardMedia,
  Grid, Typography, CardActionArea,
  Paper,
} from '@material-ui/core';
import './SelectServices.scss';
import serviceImg from 'images/service.jpg';
import AdvancedSearch from './AdvancedSearch';
import 'styles/_layout.scss';

export default function SelectServices({
  services,
  onChange,
}) {
  return (
    <React.Fragment>
      <Paper elevation={1} className="select-services__options">
        <h2 className="select-services__title">Services</h2>
        <div className="grow" />
        <AdvancedSearch onChange={onChange} />
      </Paper>
      <Grid container spacing={32}>
        {services.map(service => (
          <Grid item md={3} key={service.id}>
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
