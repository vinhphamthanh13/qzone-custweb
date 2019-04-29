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
} from 'lodash';
import {
  dateFormatDash,
  timeSlotFormat,
  defaultDateFormat,
} from 'utils/constants';
import s from './TimeBoxes.module.scss';

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
    if (!slots) return null;
    const slotTable = {};
    slots
      .filter((slot) => {
        const startSec = get(slot, 'providerStartSec');
        const spotsOpen = get(slot, 'spotsOpen');
        return !!spotsOpen && moment() < moment(startSec);
      })
      .sort((a, b) => a.startSec - b.startSec).map((slot) => {
        const startSec = get(slot, 'providerStartSec');
        const duration = get(slot, 'durationSec');
        startSec.replace(' ', '-');
        slotTable[moment(startSec).format(dateFormatDash)] = slotTable[moment(startSec).format(dateFormatDash)]
          ? [
            ...slotTable[moment(startSec).format(dateFormatDash)],
            {
              time: moment(startSec),
              duration,
              action: this.onHourChange({ start: moment(startSec).unix(), duration }),
            },
          ] : [];
        return null;
      });
    return slotTable;
  };

  renderTimeBox = data => Object.keys(data).map(
    date => (
      <div key={uuidv1()} className={s.availableDateSlots}>
        <div className={s.dateSlot}>
          <Typography variant="subheading" color="inherit">
            {moment(date.replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1')).format(defaultDateFormat)}
          </Typography>
        </div>
        <>
          {
            chunk(data[date], 3).map(row => (
              <div key={uuidv1()} className={s.timeRow}>
                {row.map((slot) => {
                  const { time, action } = slot;
                  return (
                    <Button
                      key={uuidv1()}
                      className={s.timeSlot}
                      onClick={action}
                    >
                      <Typography variant="subheading" color="inherit">
                        {time.format(timeSlotFormat)}
                      </Typography>
                    </Button>
                  );
                })}
              </div>
            ))
          }
        </>
      </div>
    ),
  );

  render() {
    const { provider } = this.state;
    const availableSlots = get(provider, 'availableSlots');
    const hourBoxes = this.getHourBoxes(availableSlots);
    return hourBoxes ? this.renderTimeBox(hourBoxes) : (
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
