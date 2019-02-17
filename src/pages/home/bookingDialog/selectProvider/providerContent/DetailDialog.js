import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';
import CustomLink from 'components/CustomLink';
import { serviceType } from 'types/global';
import styles from './DetailDialog.module.scss';

export default function DetailDialog({ isDetailDialogOpen, togggleDetailDialog, initService }) {
  return (
    <Dialog
      open={isDetailDialogOpen}
      onClose={togggleDetailDialog}
    >
      <DialogTitle disableTypography classes={{ root: styles.title }}>
        <div className={styles.leftTitle}>
          <Typography variant="h5">{initService.name}</Typography>
          <Typography variant="subtitle2">
            <CustomLink
              text={initService.organization.name}
              to={`/organisation/${initService.organization.id}`}
            />
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle1">{initService.duration} minutes</Typography>
        </div>
      </DialogTitle>
      <DialogContent classes={{ root: styles.content }}>
        <Grid container>
          <Grid item>
            <Typography variant="body1">{initService.description}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions classes={{ root: styles.footer }}>
        <Button variant="outlined" color="primary" onClick={togggleDetailDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

DetailDialog.propTypes = {
  isDetailDialogOpen: PropTypes.bool.isRequired,
  togggleDetailDialog: PropTypes.func.isRequired,
  initService: serviceType,
};

DetailDialog.defaultProps = {
  initService: undefined,
};
