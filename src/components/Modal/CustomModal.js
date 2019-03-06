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
    classes, message, title, isOpen, onClose, type,
    okText, okCallBack, cancelText, cancelCallBack,
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
          {(okCallBack || cancelCallBack) && (
            <div className={classes.modalActions}>
              {cancelCallBack && (
                <Button
                  classes={{ root: okCallBack ? classes.cancelButton : undefined }}
                  onClick={cancelCallBack}
                >
                  {cancelText}
                </Button>
              )}
              {okCallBack
                && (
                  <Button
                    fullWidth={!cancelCallBack}
                    variant="outlined"
                    color="primary"
                    onClick={okCallBack}
                  >
                    {okText}
                  </Button>
                )}
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
  okCallBack: func,
  okText: string,
  cancelCallBack: func,
  cancelText: string,
};

CustomModal.defaultProps = {
  onClose: noop,
  okCallBack: undefined,
  okText: 'Ok',
  cancelCallBack: undefined,
  cancelText: 'Cancel',
};

export default withStyles(errorStyle)(CustomModal);
