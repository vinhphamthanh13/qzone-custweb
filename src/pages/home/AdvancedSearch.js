import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './AdvancedSearch.scss';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

export default class AdvancedSearch extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      renderedFromDate: new Date(),
      renderedToDate: new Date(),
    };
  }

  onFromDateChange = (value) => {
    const { onChange } = this.props;
    this.setState({ renderedFromDate: value });
    onChange(value, 'fromDate');
  }

  onToDateChange = (value) => {
    const { onChange } = this.props;
    this.setState({ renderedToDate: value });
    onChange(value, 'toDate');
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
      renderedFromDate, renderedToDate,
    } = this.state;

    return (
      <React.Fragment>
        <DateTimePicker
          keyboard
          label="From date"
          className="advanced-search__from-date"
          value={renderedFromDate}
          onChange={this.onFromDateChange}
        />
        <DateTimePicker
          keyboard
          label="To date"
          value={renderedToDate}
          onChange={this.onToDateChange}
        />
      </React.Fragment>
    );
  }
}
