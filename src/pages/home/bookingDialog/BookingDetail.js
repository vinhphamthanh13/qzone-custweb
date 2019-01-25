import React from 'react';
import {
  Grid, TextField, Typography, Fab,
} from '@material-ui/core';
import { bookingDetailType, serviceType } from 'types/global';
import { format } from 'date-fns';
import formatName from 'utils/formatName';
import styles from './BookingDetail.module.scss';

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
    const { bookingDetail, initService } = this.props;
    return (
      <Grid container className={styles.wrapper}>
        <Grid item md={6} className={styles.userInfo}>
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
        <Grid item md={5} className={styles.service}>
          <Typography variant="h5">{initService.name}</Typography>
          <div className={styles.serviceItems}>
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Date:</Typography></Grid>
              <Grid item md={7}>
                <Typography variant="subtitle1" color="secondary">
                  {format(bookingDetail.time.start, 'dd MMMM yyyy')}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={5}><Typography variant="body1">Starts at:</Typography></Grid>
              <Grid item md={7}>
                <Typography variant="subtitle1" color="secondary">
                  {format(bookingDetail.time.start, 'hh:mm a')}
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
          <div className={styles.serviceItems}>
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