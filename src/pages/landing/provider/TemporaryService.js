import React, { Component } from 'react';
import { func } from 'prop-types';
import chunk from 'lodash/chunk';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import { IconButton } from '@material-ui/core';
import { ChevronRight, ChevronLeft, ExpandMore } from '@material-ui/icons';
import { DATE_LABEL, TIME_FORMAT, NO_ROWS_PER_DATE, NO_SLOTS_PER_ROW } from 'utils/constants';
import s from './TemporaryService.module.scss';

class TemporaryService extends Component {
  static propTypes = {
    selectSlot: func.isRequired,
  };

  state = {
    timeSlots: [],
    chunkIndex: {},
    dateSelected: {},
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

  handleSelectedDate = date => () => {
    this.setState(oldState => ({
      dateSelected: {
        ...oldState.dateSelected,
        [date]: !oldState.dateSelected[date],
      },
    }));
  };

  render() {
    const { selectSlot } = this.props;
    const { timeSlots, chunkIndex, dateSelected } = this.state;
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
    const isDefaultExpand = Object.keys(slotsByDate).length === 1;

    return (
      <div className={s.container}>
        {Object.keys(transformedSlot).map(date => {
          const expandIconStyle = !dateSelected[date] ? s.expandMore : `${s.expandMore} ${s.expandLess}`;
          return moment(date).isValid() && (
            <div className={s.dateChunk} key={uuidv1()}>
              <div className={s.date}>
                <span>{moment(date).format(DATE_LABEL)}</span>
                <IconButton
                  color="secondary"
                  className="simple-button"
                  onClick={this.handleSelectedDate(date)}
                  disabled={isDefaultExpand}
                >
                  <ExpandMore className={expandIconStyle} color="inherit" />
                </IconButton>
              </div>
              {(dateSelected[date] || isDefaultExpand) && (
                <div className={s.chunkSlots}>
                  <div className={s.slotHolder}>
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
                      )})
                    }
                  </div>
                  <div className={s.showMoreSlot}>
                    <div className={s.extraCta}>
                      <IconButton
                        className="simple-button button-sm"
                        color="inherit"
                        disabled={!chunkIndex[`${date}-index`] || chunkIndex[`${date}-index`] === 0}
                        onClick={this.handleChunkIndexLess(
                          date
                        )}
                      >
                        <ChevronLeft />
                        <span>&nbsp;less</span>
                      </IconButton>
                      <IconButton
                        className="simple-button button-sm"
                        color="inherit"
                        onClick={this.handleChunkIndexMore(
                          date, transformedSlot[`${date}-max`],
                        )}
                        disabled={chunkIndex[`${date}-index`] === transformedSlot[`${date}-max`]
                        || transformedSlot[`${date}-max`] === 0}
                      >
                        <span>more&nbsp;</span>
                        <ChevronRight />
                      </IconButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    );
  }
}

export default TemporaryService;
