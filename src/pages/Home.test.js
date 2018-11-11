import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';
import CategoryTabs from './home/CategoryTabs';
import SelectServices from './home/SelectServices';

describe('Home', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Home />);
  });

  it('should contain CategoryTabs and SelectServices', () => {
    expect(wrapper.find(CategoryTabs)).toHaveLength(1);
    expect(wrapper.find(SelectServices)).toHaveLength(1);
  });

  it('should pass props to CategoryTabs correctly', () => {
    const selectedCategory = 'selectedCategory';

    wrapper.setState({ selectedCategory });

    expect(wrapper.find(CategoryTabs).prop('value')).toBe(selectedCategory);
  });

  it('should pass props to SelectServices correctly', () => {
    const subCategories = 'subCategories';
    const selectedSubCategory = 'selectedSubCategory';

    wrapper.setState({ subCategories, selectedSubCategory });

    expect(wrapper.find(SelectServices).prop('subCategories')).toBe(subCategories);
    expect(wrapper.find(SelectServices).prop('selectedSubCategory'))
      .toBe(selectedSubCategory);
  });
});
