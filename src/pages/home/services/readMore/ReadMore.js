import React from 'react';
import {
  func, bool, string, number,
} from 'prop-types';
import { Domain } from '@material-ui/icons';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Typography,
} from '@material-ui/core';
import CustomLink from 'components/CustomLink';
import RateStar from 'components/Rating/RateStar';
import styles from './ReadMore.module.scss';

const ReadMore = (props) => {
  const {
    isOpen, onClose, serviceName, orgName, orgDescription, orgId, instantBooking,
    rating, reviews,
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
        <RateStar rating={rating} reviews={reviews} />
        <div className={styles.blockItem}>
          <div className={styles.iconInfo}>
            <Domain className={styles.icon} />
            <Typography variant="body1">
              <CustomLink text={orgName} to={`/organization/${orgId}`} />
            </Typography>
          </div>
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: styles.readMoreContent }}>
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
  orgName: string.isRequired,
  orgId: string.isRequired,
  orgDescription: string.isRequired,
  instantBooking: func.isRequired,
  rating: number,
  reviews: number,
};

ReadMore.defaultProps = {
  rating: 0,
  reviews: 0,
};

export default ReadMore;
