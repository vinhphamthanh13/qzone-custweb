import React from 'react';
import {
  func,
} from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import {
  get,
  chunk,
  noop,
} from 'lodash';
import s from './SelectTime.module.scss';

export class TimeBoxes extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { provider } = props;
    const { provider: cachedProvider } = state;
    if (provider !== cachedProvider) {
      return { provider };
    }
    return null;
  }

  state = {
    provider: null,
  };

  onHourChange = ({ start, duration }) => (event) => {
    event.preventDefault();
    this.props.onSelectSlot({
      start: start.valueOf(),
      duration,
    });
  };

  getHourBoxes = (slots) => {
    if (!slots) return [];
    const slotTable = {};
    const timeBoxes = slots
      .filter((slot) => {
        const startSec = get(slot, 'providerStartSec');
        const spotsOpen = get(slot, 'spotsOpen');
        return !!spotsOpen && moment() < moment(startSec);
      })
      .sort((a, b) => a.startSec - b.startSec).map((slot) => {
        console.log('filtered slots', slot);
        const startSec = get(slot, 'providerStartSec');
        const spotsOpen = get(slot, 'spotsOpen');
        startSec.replace(' ', '-');
        slotTable[moment(startSec).format('DD-MM-YYYY')] = slotTable[moment(startSec).format('DD-MM-YYYY')]
          ? [
            ...slotTable[moment(startSec).format('DD-MM-YYYY')],
            moment(startSec),
          ] : [];
        const time = moment(startSec);
        const duration = get(slot, 'durationSec');
        const action = spotsOpen
          ? this.onHourChange({ start: time, duration }) : noop;
        return ({
          key: uuidv1(),
          time,
          canBook: !!spotsOpen,
          duration,
          action,
          display: moment(time).format('hh:mm a'),
        });
      });
    console.log('slotTable', slotTable);
    return chunk(timeBoxes, 3);
  };

  renderTimeBox = list => list.map(row => (
    <div key={uuidv1()} className={s.timeRow}>
      {row.map((slot) => {
        const { display, action } = slot;
        return (
          <Button
            key={uuidv1()}
            className={s.timeSlot}
            onClick={action}
          >
            <Typography variant="subheading" color="inherit">
              {display}
            </Typography>
          </Button>
        );
      })}
    </div>
  ));

  render() {
    const { provider } = this.state;
    const availableSlots = get(provider, 'availableSlots');
    const hourBoxes = this.getHourBoxes(availableSlots);
    return hourBoxes.length > 0 ? this.renderTimeBox(hourBoxes) : (
      <div className={s.noneSlot}>
        <Typography variant="subheading" color="inherit">
          There is no slot available from our provider! Please find more in the next day!
        </Typography>
      </div>
    );
  }
}

TimeBoxes.propTypes = {
  onSelectSlot: func.isRequired,
};

export default TimeBoxes;
