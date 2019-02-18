import React from 'react';
import { string, func, bool } from 'prop-types';
import { classesType } from 'types/global';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import { noop } from 'utils/constants';
import logo from 'images/logo.png';
import errorStyle from './ModalStyle';

const CustomModal = (props) => {
  const {
    classes, message, title, isOpen, onClose, type,
  } = props;
  const headingColor = type === 'error' ? 'secondary' : 'primary';
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={classes.modalRoot}
    >
      <Paper className={classes.paperRoot}>
        <div className={classes.logo}>
          <Avatar className={classes.avatarRoot} src={logo} />
        </div>
        <div className={classes.message}>
          <Typography variant="h5" color={headingColor} component="h5">
            {title.toUpperCase()}
          </Typography>
          <Typography variant="subheading" color="textSecondary">{message}</Typography>
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
};

CustomModal.defaultProps = {
  onClose: noop,
};

export default withStyles(errorStyle)(CustomModal);
