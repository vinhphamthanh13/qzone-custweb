import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Typography,
  Card, CardActionArea, CardContent,
} from '@material-ui/core';

export default function DateSelectBox({ onChange, dateBoxes = [], selectedDay }) {
  return (
    <div className="select-date">
      <Grid container spacing={32}>
        {dateBoxes.map(dateBox => (
          <Grid item sm={4} key={dateBox.toISOString()}>
            <Card classes={{
              root: selectedDay && selectedDay.format('l') === dateBox.format('l')
                ? 'select-time__active-item' : '',
            }}
            >
              <CardActionArea onClick={() => onChange(dateBox)}>
                <CardContent className="select-date_content">
                  <Typography variant="subtitle1">{dateBox.format('L')}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

DateSelectBox.propTypes = {
  dateBoxes: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedDay: PropTypes.objectOf(
    Date,
  ).isRequired,
};
