import React from 'react';
import {
  Typography, Grid, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
import { serviceType } from 'types/global';
import './ServiceDetail.scss';
import CustomLink from 'components/CustomLink';

export default class ServiceDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDialogDescOpen: false,
    };
  }

  handleClose = () => {
    this.setState({ isDialogDescOpen: false });
  }

  openDialog = (event) => {
    event.preventDefault();
    this.setState({ isDialogDescOpen: true });
  }

  render() {
    const { service } = this.props;
    const { isDialogDescOpen } = this.state;

    return (
      <React.Fragment>
        <Dialog
          open={isDialogDescOpen}
          onClose={this.handleClose}
          aria-labelledby="description-dialog"
        >
          <DialogTitle id="description-dialog">{service.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>{service.description || ''}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Typography align="center" variant="title">{service.name}</Typography>
        <div className="service-detail">
          <Typography variant="subtitle2">
            {(service.description || '').substring(0, 300)}...&nbsp;
            <CustomLink text="Read more" to="#" onClick={this.openDialog} />
          </Typography>
        </div>
        <div className="service-detail">
          <Grid container className="service-detail__item">
            <Grid item sm={6}>
              <Typography variant="caption">Duration:</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2">{service.duration} minutes</Typography>
            </Grid>
          </Grid>
          <Grid container className="service-detail__item">
            <Grid item sm={6}>
              <Typography variant="caption">Organisation:</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2">
                <CustomLink text={service.organization.name} to={`/organisation/${service.organization.id}`} />
              </Typography>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

ServiceDetail.propTypes = {
  service: serviceType.isRequired,
};
