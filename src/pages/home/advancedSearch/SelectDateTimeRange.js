import React from 'react';
import TimePicker from 'material-ui-pickers/TimePicker';
import DatePicker from 'material-ui-pickers/DatePicker';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid,
} from '@material-ui/core';
import './SelectDateTimeRange.scss';

export default function SelectDateTimeRange({
  selectedDate, onDateChange, selectedTime, onTimeChange,
  isOpen, onCloseSelectDateTimeRange,
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={onCloseSelectDateTimeRange}
      aria-labelledby="select-date-time-dialog"
    >
      <DialogTitle id="select-date-time-dialog">Specify date / time</DialogTitle>
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item md={6}>
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
            />
          </Grid>
          <Grid item md={5}>
            <TimePicker
              value={selectedTime}
              onChange={onTimeChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={onCloseSelectDateTimeRange}
        >
          {'Specify'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
