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
    services: [{
      id: 'ser-111',
      name: 'Service 111',
    }],
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
}, {
  id: 'cat-3',
  name: 'Second category',
  subs: [{
    id: 'sub-cat-3',
    name: 'First sub category 3',
    services: [{
      id: 'ser-5',
      name: 'Service 5',
    }],
  }],
}, {
  id: 'cat-4',
  name: 'Second category',
  subs: [{
    id: 'sub-cat-4',
    name: 'First sub category 4',
    services: [{
      id: 'ser-14',
      name: 'Service 14',
    }],
  }],
}];

export default class AdvancedSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      renderedDate: new Date(),
      renderedTime: new Date(),
      isSelectDateTimeRangeOpen: false,
      expandedCategories: {},
    };
  }

  onDateChange = (value) => {
    const { onChange } = this.props;
    this.setState({ renderedDate: value });
    onChange(getDate(value), 'date');
  }

  onTimeChange = (value) => {
    const { onChange } = this.props;
    this.setState({ renderedTime: value });
    onChange(getTime(value), 'time');
  }

  showSelectDateTimeRange = () => {
    this.setState({ isSelectDateTimeRangeOpen: true });
  }

  onCloseSelectDateTimeRange = () => {
    this.setState({ isSelectDateTimeRangeOpen: false });
  }

  handleExpandClick = (categoryId) => {
    this.setState(state => ({
      expandedCategories: {
        ...state.expandedCategories,
        [categoryId]: !state.expandedCategories[categoryId],
      },
    }));
  }

  onSelectSubCategory = (value) => {
    const { onChange } = this.props;
    onChange(value, 'subCategory');
  }

  render() {
    const {
      renderedDate, renderedTime,
      isSelectDateTimeRangeOpen, expandedCategories,
    } = this.state;

    return (
      <Grid container>
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
        <Grid item md={12} className="advanced-search__service">
          <SelectServices
            categories={categories}
            onSelectSubCategory={this.onSelectSubCategory}
            expandedCategories={expandedCategories}
            handleExpandClick={this.handleExpandClick}
          />
        </Grid>
      </Grid>
    );
  }
}
