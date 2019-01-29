import React from 'react';
import {
  Typography, Grid, Button, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
import { serviceType } from 'types/global';
import CustomLink from 'components/CustomLink';
import styles from './ServiceDetail.module.scss';

export default class ServiceDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDialogDescOpen: false,
    };
  }

  handleClose = () => {
    this.setState({ isDialogDescOpen: false });
  };

  openDialog = (event) => {
    event.preventDefault();
    this.setState({ isDialogDescOpen: true });
  };

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
        <Tooltip title={service.name} placement="top">
          <Typography align="center" variant="title" noWrap>{service.name}</Typography>
        </Tooltip>
        <div className={styles.serviceDetail}>
          <Typography variant="body2">
            {(service.description || '').substring(0, 300)}
            {service.description.length > 300
              && <>...&nbsp;<CustomLink text="Read more" to="#" onClick={this.openDialog} /></>}
          </Typography>
        </div>
        <div className={styles.blockItem}>
          <Grid container>
            <Grid item sm={4}>
              <Typography variant="caption">Duration:</Typography>
            </Grid>
            <Grid item sm={8}>
              <Typography variant="subtitle2">{service.duration} minutes</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4}>
              <Typography variant="caption">Organisation:</Typography>
            </Grid>
            <Grid item sm={8}>
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
