import React from 'react';
import {
  Grid,
} from '@material-ui/core';
import './Home.scss';
import CategoryTabs from './home/CategoryTabs';
import SelectServices from './home/SelectServices';

const services = [{
  id: 'cat-1',
  name: 'First category',
}, {
  id: 'cat-2',
  name: 'Second category',
}, {
  id: 'cat-3',
  name: 'Second category',
}, {
  id: 'cat-4',
  name: 'Second category',
}, {
  id: 'cat-11',
  name: 'First category',
}, {
  id: 'cat-22',
  name: 'Second category',
}, {
  id: 'cat-33',
  name: 'Second category',
}, {
  id: 'cat-44',
  name: 'Second category',
}];

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: undefined,
      toDate: undefined,
      searchText: undefined,
      subCategory: undefined,
      subCategories: [],
      selectedCategory: 0,
      selectedSubCategory: undefined,
    };
  }

  onChange = (value, key) => {
    const { history } = this.props;
    this.setState({ [key]: value });
    if (value.id) {
      history.push(`/organisation/${value.id}`);
    }
  }

  onSubmit = () => {
    console.log(this.state);
  }

  onCategoryChange = (event, selectedCategory) => {
    this.setState(oldState => ({
      selectedCategory,
      selectedSubCategory: undefined,
      subCategories: oldState.subCategories.length ? [] : [
        { id: 'sub-1', name: 'Sub Category One' },
        { id: 'sub-2', name: 'Sub Category Two' },
        { id: 'sub-3', name: 'Sub Category Three' },
      ],
    }));
  }

  render() {
    const { selectedCategory, subCategories, selectedSubCategory } = this.state;

    return (
      <Grid container>
        <Grid item sm={12}>
          <CategoryTabs
            value={selectedCategory}
            onCategoryChange={this.onCategoryChange}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />
        </Grid>
        <Grid item sm={12} className="home__select-service">
          <SelectServices
            services={services}
            onChange={this.onChange}
            subCategories={subCategories}
            selectedSubCategory={selectedSubCategory}
          />
        </Grid>
      </Grid>
    );
  }
}
