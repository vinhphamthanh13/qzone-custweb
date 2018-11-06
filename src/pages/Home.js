import React from 'react';
import {
  Grid,
} from '@material-ui/core';
import './Home.scss';
import CategoryTabs from './home/CategoryTabs';
import SubCategoryTabs from './home/SubCategoryTabs';
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
    this.setState({ [key]: value });
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
        { id: 'sub-4', name: 'Sub Category Four' },
        { id: 'sub-5', name: 'Sub Category Five' },
        { id: 'sub-11', name: 'Sub Category One' },
        { id: 'sub-22', name: 'Sub Category Two' },
        { id: 'sub-33', name: 'Sub Category Three' },
        { id: 'sub-44', name: 'Sub Category Four' },
        { id: 'sub-55', name: 'Sub Category Five' },
      ],
    }));
  }

  render() {
    const { selectedCategory, subCategories, selectedSubCategory } = this.state;

    return (
      <Grid container>
        <Grid item md={12}>
          <CategoryTabs
            value={selectedCategory}
            onCategoryChange={this.onCategoryChange}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />
          <SubCategoryTabs
            selectedSubCategory={selectedSubCategory}
            subCategories={subCategories}
            onChange={this.onChange}
          />
        </Grid>
        <Grid item md={12} className="home__select-service">
          <SelectServices
            services={services}
            onChange={this.onChange}
          />
        </Grid>
      </Grid>
    );
  }
}
