import React, { Component } from 'react';
import { func } from 'prop-types';
import chunk from 'lodash/chunk';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import { IconButton } from '@material-ui/core';
import { ChevronRight, ChevronLeft } from '@material-ui/icons';
import { FULL_DATE, TIME_FORMAT, NO_ROWS_PER_DATE, NO_SLOTS_PER_ROW } from 'utils/constants';
import s from './TemporaryService.module.scss';

class TemporaryService extends Component {
  static propTypes = {
    selectSlot: func.isRequired,
  };

  state = {
    timeSlots: [],
    chunkIndex: {},
  };

  static getDerivedStateFromProps(props) {
    const { timeSlots } = props;
    const updatedState = {};

    if (timeSlots.length > 0) {
      updatedState.timeSlots = timeSlots;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  handleChunkIndexMore = (date, max)  => () => {
    const { chunkIndex } = this.state;
    const index = chunkIndex[`${date}-index`] || 0;
    this.setState(oldState => ({
      chunkIndex: {
        ...oldState.chunkIndex,
        [`${date}-index`]: index < max ? index + 1 : max,
      }
    }));
  };

  handleChunkIndexLess = date  => () => {
    const { chunkIndex } = this.state;
    const index = chunkIndex[`${date}-index`] || 0;

    this.setState(oldState => ({
      chunkIndex: {
        ...oldState.chunkIndex,
        [`${date}-index`]: index > 0 ? index - 1 : 0,
      }
    }));
  };

  render() {
    const { selectSlot } = this.props;
    const { timeSlots, chunkIndex } = this.state;
    const slotsByDate = {};
    timeSlots.map(slot => {
      const date = slot.providerStartSec.replace(/\s.*/, '');
      slotsByDate[date] = slotsByDate[date] ? slotsByDate[date] : [];
      slotsByDate[date].push(slot);
      return null;
    });
    const transformedSlot = {};
    Object.keys(slotsByDate).map(date => {
      const chunkSlots = chunk(slotsByDate[date], NO_SLOTS_PER_ROW);
      transformedSlot[date] = chunk(chunkSlots, NO_ROWS_PER_DATE);
      transformedSlot[`${date}-max`] = transformedSlot[date].length - 1;
      return null;
    });

    return (
      <div className={s.container}>
        {Object.keys(transformedSlot).map(date => moment(date).isValid() && (
          <div key={uuidv1()}>
            <div className={s.date}>
              {moment(date).format(FULL_DATE)}
            </div>
            <div className={s.chunkSlots}>
              {transformedSlot[date][chunkIndex[`${date}-index`] || 0] &&
                transformedSlot[date][chunkIndex[`${date}-index`] || 0].map(chunkRow => {
                return (
                    <div className={s.row} key={uuidv1()}>
                      {chunkRow.map(slot => (
                        /* eslint-disable-next-line */
                        <div className={s.slot} key={slot.id} onClick={selectSlot(slot)}>
                          {moment(slot.providerStartSec).format(TIME_FORMAT)}
                        </div>
                      ))}
                    </div>
                )
              })}
              <div className={s.showMoreSlot}>
                <div className={s.extraCta}>
                  <IconButton
                    className="simple-button"
                    color="inherit"
                    disabled={!chunkIndex[`${date}-index`] || chunkIndex[`${date}-index`] === 0}
                    onClick={this.handleChunkIndexLess(
                      date
                    )}
                  >
                    <ChevronLeft />
                    <span>&nbsp;prev</span>
                  </IconButton>
                  <IconButton
                    className="simple-button"
                    color="inherit"
                    onClick={this.handleChunkIndexMore(
                      date, transformedSlot[`${date}-max`],
                    )}
                    disabled={chunkIndex[`${date}-index`] === transformedSlot[`${date}-max`]}
                  >
                    <span>next&nbsp;</span>
                    <ChevronRight />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default TemporaryService;
