import React from 'react';
import {
  string,
  func,
  bool,
} from 'prop-types';
import { classesType } from 'types/global';
import {
  Modal, Typography, Button, Avatar,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { noop } from 'lodash';
import logo from 'images/logo.png';
import s from './ModalStyle';

const CustomModal = (props) => {
  const {
    classes, message, title, isOpen, onClose, type,
    okText, okCallBack, cancelText, cancelCallBack,
    className, isBackDropClickDisabled,
  } = props;
  const headingColor = type === 'error' ? 'secondary' : 'primary';
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableBackdropClick={isBackDropClickDisabled}
      className={`${classes.modalRoot} ${className}`}
    >
      <Paper className="verification-modal">
        <div className="verification-modal-logo">
          <Avatar className="verification-modal-avatar" src={logo} />
        </div>
        <div className="verification-modal-content">
          <Typography className="text-capitalize text-bold" variant="title" color={headingColor}>
            {title}
          </Typography>
          <Typography
            variant="subheading"
            color="textSecondary"
          >{
            message.length > 120 ? `${message.replace(/\./g, ' ').substring(0, 120)}...` : message
          }
          </Typography>
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
  className: string,
  isBackDropClickDisabled: bool,
};

CustomModal.defaultProps = {
  onClose: noop,
  okCallBack: undefined,
  okText: 'Ok',
  cancelCallBack: undefined,
  cancelText: 'Cancel',
  className: '',
  isBackDropClickDisabled: false,
};

export default withStyles(s)(CustomModal);
