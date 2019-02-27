import React from 'react';
import { string, func, bool } from 'prop-types';
import { classesType } from 'types/global';
import {
  Modal, Typography, Button, Avatar,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { noop } from 'utils/constants';
import logo from 'images/logo.png';
import errorStyle from './ModalStyle';

const CustomModal = (props) => {
  const {
    classes, message, title, isOpen, onClose, type, okButton, okCallBack,
  } = props;
  const headingColor = type === 'error' ? 'secondary' : 'primary';
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={classes.modalRoot}
    >
      <Paper className="verification-modal">
        <div className="verification-modal-logo">
          <Avatar className="verification-modal-avatar" src={logo} />
        </div>
        <div className="verification-modal-content">
          <Typography variant="h5" color={headingColor}>
            {title}
          </Typography>
          <Typography variant="subheading" color="textSecondary">{message}</Typography>
          {okButton && (
            <div className={classes.okButton}>
              <Button
                fullWidth
                variant="outlined"
                onClick={okCallBack}
              >Ok
              </Button>
            </div>)
          }
        </div>
      </Paper>
    </Modal>);
};

CustomModal.propTypes = {
  classes: classesType.isRequired,
  message: string.isRequired,
  title: string.isRequired,
  isOpen: bool.isRequired,
  onClose: func,
  type: string.isRequired,
  okButton: bool,
  okCallBack: func,
};

CustomModal.defaultProps = {
  onClose: noop,
  okButton: false,
  okCallBack: noop,
};

export default withStyles(errorStyle)(CustomModal);
