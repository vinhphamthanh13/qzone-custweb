import React from 'react';
import {
  Grid, TextField, Typography, Fab,
} from '@material-ui/core';
import moment from 'moment-timezone';
import './BookingDetail.scss';
import { bookingDetailType, serviceType } from 'types/global';
import formatName from 'utils/formatName';

class BookingDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phoneNumber: '',
    };
    this.timeZone = props.bookingDetail.provider.timeZoneId;
  }

  handleChange = key => (event) => {
    this.setState({ [key]: event.target.value });
  }

  render() {
    const { name, email, phoneNumber } = this.state;
    const { bookingDetail, initService } = this.props;
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
          <Typography variant="h5">{initService.name}</Typography>
          <div className="booking-detail__service-items">
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Date:</Typography></Grid>
              <Grid item md={7}>
                <Typography variant="subtitle1" color="secondary">
                  {moment(bookingDetail.time.start).tz(this.timeZone).format('DD MMMM YYYY')}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Starts at:</Typography></Grid>
              <Grid item md={7}>
                <Typography variant="subtitle1" color="secondary">
                  {moment(bookingDetail.time.start).tz(this.timeZone).format('hh:mm A')}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Service provider:</Typography></Grid>
              <Grid item md={7}>
                <Typography variant="subtitle1" color="secondary">
                  {formatName(bookingDetail.provider.name)}
                </Typography>
              </Grid>
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

BookingDetail.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  initService: serviceType.isRequired,
};

export default BookingDetail;
