import React, { Component } from 'react';
import {
  arrayOf, object, bool, func, objectOf, string,
} from 'prop-types';
import {
  Grid, Paper, MenuItem, Typography,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import s from './EventMenu.style';

class EventMenu extends Component {
  static propTypes = {
    classes: objectOf(string).isRequired,
    eventList: arrayOf(object).isRequired,
    isOpenList: bool.isRequired,
    handleCloseList: func.isRequired,
    handleViewEvent: func.isRequired,
  };

  componentDidMount() {
    const { handleCloseList } = this.props;
    window.addEventListener('resize', handleCloseList);
  }

  componentWillUnmount() {
    const { handleCloseList } = this.props;
    window.removeEventListener('resize', handleCloseList);
  }

  render() {
    const {
      isOpenList, handleCloseList, eventList, classes, handleViewEvent,
    } = this.props;

    return isOpenList && eventList.length ? (
      <Grid className="cover-bg-black cover-bg-black-content" onClick={handleCloseList}>
        <Paper className="event-list">
          {eventList.sort((a, b) => b.slot.startSec - a.slot.startSec).map((event) => {
            const current = event.slot.startSec;
            console.log('current', current);
            return (
              <MenuItem key={event.id} onClick={handleViewEvent} className={classes.menuItem}>
                <div>
                  <Typography variant="subheading" color="textPrimary" className={classes.title}>
                    {event.serviceName}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="textSecondary" className={classes.content}>
                    {event.providerName} -
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className={classes.content}>
                    {event.geoLocation.streetAddress}
                  </Typography>
                </div>
              </MenuItem>
            );
          })}
        </Paper>
      </Grid>
    ) : null;
  }
}

export default withStyles(s)(EventMenu);
