import React, { Component } from 'react';
import { string } from 'prop-types';
import { Button, Popover, Typography } from '@material-ui/core';
import { ContactSupportRounded } from '@material-ui/icons';
import {
  POPOVER_TYPE, passwordPolicy, telephonePolicy, registerPopoverPosition,
} from 'utils/constants';
import s from './PolicyPopover.module.scss';

class PolicyPopover extends Component {
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
    const { anchorEl } = this.state;
    const openPopover = !!anchorEl;

    const renderContent = () => {
      const { type } = this.props;
      let whichPolicy;
      if (type === POPOVER_TYPE.PASSWORD) {
        whichPolicy = passwordPolicy;
      } else if (type === POPOVER_TYPE.TEL) {
        whichPolicy = telephonePolicy;
      }

      return (
        <ul className={s.hintConventions}>
          <Typography>{whichPolicy.statement}</Typography>
          <ul>
            {whichPolicy.items.map(rule => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </ul>
      );
    };

    return (
      <div className="z-index-highest">
        <Button
          className={`${s.hint} simple-button circle-button`}
          aria-owns={openPopover ? 'telephone-format-hint' : undefined}
          aria-haspopup="true"
          onClick={this.handlePopoverOpen}
        >
          <ContactSupportRounded />
        </Button>
        <Popover
          id="telephone-format-hint"
          open={openPopover}
          anchorEl={anchorEl}
          onClose={this.handlePopoverClose}
          anchorOrigin={registerPopoverPosition.anchorOrigin}
          transformOrigin={registerPopoverPosition.transformOrigin}
          disableAutoFocus
        >
          {renderContent()}
        </Popover>
      </div>
    );
  }
}

PolicyPopover.propTypes = {
  type: string,
};

PolicyPopover.defaultProps = {
  type: POPOVER_TYPE.PASSWORD,
};

export default PolicyPopover;
