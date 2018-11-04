import React, { PureComponent } from 'react';
import getDate from 'date-fns/getDate';
import getTime from 'date-fns/getTime';
import { Button, Grid } from '@material-ui/core';
import SelectServices from './advancedSearch/SelectServices';
import SelectDateTimeRange from './advancedSearch/SelectDateTimeRange';
import './AdvancedSearch.scss';

const categories = [{
  id: 'cat-1',
  name: 'First category',
  subs: [{
    id: 'sub-cat-1-1',
    name: 'First sub category',
    services: [{
      id: 'ser-1',
      name: 'Service 1',
    }],
  }, {
    id: 'sub-cat-1-2',
    name: 'Second sub category',
    services: [],
  }],
}, {
  id: 'cat-2',
  name: 'Second category',
  subs: [{
    id: 'sub-cat-2',
    name: 'First sub category 2',
    services: [{
      id: 'ser-2',
      name: 'Service 2',
    },
    {
      id: 'ser-3',
      name: 'Service 3',
    }],
  }],
}];
export default class AdvancedSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      service: '',
      date: '',
      time: '',
      renderedDate: new Date(),
      renderedTime: new Date(),
      isSelectDateTimeRangeOpen: false,
    };
  }

  onSelectService = (event) => {
    this.setState({ service: event.target.value });
  }

  onDateChange = (value) => {
    this.setState({ date: getDate(value), renderedDate: value });
  }

  onTimeChange = (value) => {
    this.setState({ time: getTime(value), renderedTime: value });
  }

  showSelectDateTimeRange = () => {
    this.setState({ isSelectDateTimeRangeOpen: true });
  }

  onCloseSelectDateTimeRange = () => {
    this.setState({ isSelectDateTimeRangeOpen: false });
  }

  onAdvancedSearch = () => {
    console.log(this.state);
  }

  render() {
    const {
      service, renderedDate, renderedTime,
      isSelectDateTimeRangeOpen,
    } = this.state;

    return (
      <form>
        <h2 className="advanced-search__title">Advanced search</h2>
        <Grid container>
          <Grid item md={12} className="advanced-search__service">
            <SelectServices
              categories={categories}
              selectedService={service}
              onSelectService={this.onSelectService}
            />
          </Grid>
          <Grid item md={12} className="advanced-search__date-time">
            <Button
              variant="outlined"
              color="primary"
              onClick={this.showSelectDateTimeRange}
            >
              {'I  am  looking  for  specific  date/time'}
            </Button>
            <SelectDateTimeRange
              selectedDate={renderedDate}
              selectedTime={renderedTime}
              onDateChange={this.onDateChange}
              onTimeChange={this.onTimeChange}
              isOpen={isSelectDateTimeRangeOpen}
              onCloseSelectDateTimeRange={this.onCloseSelectDateTimeRange}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={this.onAdvancedSearch}
        >
          {'Search'}
        </Button>
      </form>
    );
  }
}
