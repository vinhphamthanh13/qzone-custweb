import React from 'react';
import {
  string,
  func,
  bool,
} from 'prop-types';
import {
  Cancel,
  CheckCircle,
} from '@material-ui/icons';
import {
  Modal,
  Typography,
  IconButton,
  Button,
  Avatar,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { noop } from 'lodash';
import logo from 'images/logo.png';
import s from './CustomModal.module.scss';

const CustomModal = (props) => {
  const {
    message,
    title,
    isOpen,
    onClose,
    type,
    okText,
    okCallBack,
    cancelCallBack,
    className,
    isBackDropClickDisabled,
  } = props;
  const headingColor = type === 'error' ? 'secondary' : 'primary';
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableBackdropClick={isBackDropClickDisabled}
      className={`${s.modalRoot} ${className}`}
    >
      <Paper className={s.wrapper}>
        <div className={s.wrapperLogo}>
          <Avatar className={s.wrapperAvatar} src={logo} />
        </div>
        <div className={s.content}>
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
            <div className={s.modalActions}>
              {cancelCallBack && (
                <IconButton
                  className={s.cancelButton}
                  onClick={cancelCallBack}
                >
                  <Cancel color="inherit" className="icon-lg" />
                </IconButton>
              )}
              {okCallBack
                && (
                  <Button
                    fullWidth={!cancelCallBack}
                    variant="outlined"
                    color="inherit"
                    onClick={okCallBack}
                    className="main-button"
                  >
                    <CheckCircle color="inherit" className="icon-normal icon-in-button-left" />
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
  message: string.isRequired,
  title: string.isRequired,
  isOpen: bool.isRequired,
  onClose: func,
  type: string.isRequired,
  okCallBack: func,
  okText: string,
  cancelCallBack: func,
  className: string,
  isBackDropClickDisabled: bool,
};

CustomModal.defaultProps = {
  onClose: noop,
  okCallBack: undefined,
  okText: 'Ok',
  cancelCallBack: undefined,
  className: '',
  isBackDropClickDisabled: true,
};

export default CustomModal;
