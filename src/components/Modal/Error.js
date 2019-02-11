import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import { noop } from 'utils/constants';
import logo from 'images/logo.png';
import errorStyle from './ModalStyle';

const Error = (props) => {
  const {
    classes, errorMessage, errorTitle, isOpen, onClose,
  } = props;
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className={classes.errorRoot}
    >
      <Paper className={classes.errorPaperRoot}>
        <div className={classes.logo}>
          <Avatar className={classes.avatarRoot} src={logo} />
        </div>
        <div className={classes.errorMessage}>
          <Typography variant="h5" color="secondary" component="h5">
            {errorTitle.toUpperCase()}
          </Typography>
          <Typography variant="subheading" color="textSecondary">{errorMessage}</Typography>
        </div>
      </Paper>
    </Modal>);
};

Error.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  errorTitle: PropTypes.string.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

Error.defaultProps = {
  onClose: noop,
};

export default withStyles(errorStyle)(Error);
