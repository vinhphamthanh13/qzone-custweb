import React from 'react';
import {
  func, bool, string, number,
} from 'prop-types';
import { AccessTime, LocationOn } from '@material-ui/icons';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Typography,
} from '@material-ui/core';
import CustomLink from 'components/CustomLink';
import RateStar from '../rating/RateStar';
import styles from './ReadMore.module.scss';

const ReadMore = (props) => {
  const {
    isOpen, onClose, serviceName, duration, orgName, orgDescription, orgId, instantBooking,
  } = props;
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="description-dialog"
      classes={{ paper: styles.readMorePaper }}
    >
      <DialogTitle id="description-dialog">
        <div className={styles.readMoreTitle}>{serviceName}</div>
        <RateStar rating={5} reviews={4000} />
        <div className={styles.blockItem}>
          <div className={styles.iconInfo}>
            <AccessTime className={styles.icon} />
            <Typography variant="body1" color="primary">{duration} minutes</Typography>
          </div>
          <div className={styles.iconInfo}>
            <LocationOn className={styles.icon} />
            <Typography variant="body1">
              <CustomLink text={orgName} to={`/organisation/${orgId}`} />
            </Typography>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{orgDescription}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <div className="flex full-width h-space-btw">
          <Button variant="outlined" onClick={instantBooking} className="main-button">Book Now!</Button>
          <Button variant="text" onClick={onClose} color="inherit" className="simple-button">Close</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

ReadMore.propTypes = {
  isOpen: bool.isRequired,
  onClose: func.isRequired,
  serviceName: string.isRequired,
  duration: number.isRequired,
  orgName: string.isRequired,
  orgId: string.isRequired,
  orgDescription: string.isRequired,
  instantBooking: func.isRequired,
};

export default ReadMore;
