import React from 'react';
import {
  Grid, TextField, Typography, Fab,
} from '@material-ui/core';
import './BookingDetail.scss';

class BookingDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phoneNumber: '',
    };
  }

  handleChange = key => (event) => {
    this.setState({ [key]: event.target.value });
  }

  render() {
    const { name, email, phoneNumber } = this.state;

    return (
      <Grid container className="booking-detail__wrapper">
        <Grid item md={6} className="booking-detail__user-info">
          <TextField
            required
            fullWidth
            label="Name"
            value={name}
            onChange={this.handleChange('name')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            label="Email"
            value={email}
            onChange={this.handleChange('email')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            label="Phone number"
            value={phoneNumber}
            onChange={this.handleChange('phoneNumber')}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item md={5} className="booking-detail__service">
          <Typography variant="h5">Art Class for Children(8-10 years)</Typography>
          <div className="booking-detail__service-items">
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Date:</Typography></Grid>
              <Grid item md={7}><Typography variant="subtitle1" color="secondary">18 December 2018</Typography></Grid>
            </Grid>
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Starts at:</Typography></Grid>
              <Grid item md={7}><Typography variant="subtitle1" color="secondary">09:00 PM</Typography></Grid>
            </Grid>
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Service provider:</Typography></Grid>
              <Grid item md={7}><Typography variant="subtitle1" color="secondary">Art School Group</Typography></Grid>
            </Grid>
          </div>
          <div className="booking-detail__service-items">
            <Fab color="primary" variant="extended" onClick={this.onSaveBooking}>
              Book now
            </Fab>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default BookingDetail;
