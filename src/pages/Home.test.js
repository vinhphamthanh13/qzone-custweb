import React from 'react';
import { shallow } from 'enzyme';
import { Home } from './Home';
import CategoryTabs from './home/Header';
import SelectServices from './home/Services';

describe('Home', () => {
  let wrapper;
  const props = {
    setServiceCategoriesAction: jest.fn(),
    setServicesAction: jest.fn(),
    services: [],
    serviceCategories: [],
  };

  beforeEach(() => {
    wrapper = shallow(<Home {...props} />);
  });

  it('should contain CategoryTabs and SelectServices', () => {
    expect(wrapper.find(CategoryTabs)).toHaveLength(1);
    expect(wrapper.find(SelectServices)).toHaveLength(1);
  });

  it('should pass props to CategoryTabs correctly', () => {
    const selectedCategoryId = 'selectedCategoryId';

    wrapper.setState({ selectedCategoryId });

    expect(wrapper.find(CategoryTabs).prop('value')).toBe(selectedCategoryId);
  });

  it('should pass props to SelectServices correctly', () => {
    const subCategories = [];
    const selectedSubCategoryId = 'selectedSubCategoryId';

    wrapper.setState({ subCategories, selectedSubCategoryId });

    expect(wrapper.find(SelectServices).prop('subCategories')).toBe(subCategories);
    expect(wrapper.find(SelectServices).prop('selectedSubCategoryId'))
      .toBe(selectedSubCategoryId);
  });
});
