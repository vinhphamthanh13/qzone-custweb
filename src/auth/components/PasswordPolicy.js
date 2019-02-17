import React, { Component } from 'react';
import { classesType } from 'types/global';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button, Popover, Typography } from '@material-ui/core';
import { ContactSupportRounded } from '@material-ui/icons';
import { passwordPolicyTerms, registerPopoverPosition } from 'utils/constants';
import s from './PasswordPolicy.style';

class PasswordPolicy extends Component {
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const openPopover = !!anchorEl;

    return (
      <>
        <Button
          className={`${classes.passwordHint} simple-button circle-button`}
          aria-owns={openPopover ? 'mouse-over-password-hint' : undefined}
          aria-haspopup="true"
          onClick={this.handlePopoverOpen}
        >
          <ContactSupportRounded />
        </Button>
        <Popover
          id="mouse-over-password-hint"
          open={openPopover}
          anchorEl={anchorEl}
          onClose={this.handlePopoverClose}
          anchorOrigin={registerPopoverPosition.anchorOrigin}
          transformOrigin={registerPopoverPosition.transformOrigin}
          disableAutoFocus
        >
          <ul className={classes.passwordHintConventions}>
            <Typography>Password must include at least:</Typography>
            <ul>
              {passwordPolicyTerms.map(rule => (
                <li key={rule}>
                  <Typography>{rule}</Typography>
                </li>
              ))}
            </ul>
          </ul>
        </Popover>
      </>
    );
  }
}

PasswordPolicy.propTypes = {
  classes: classesType.isRequired,
};

export default withStyles(s)(PasswordPolicy);
