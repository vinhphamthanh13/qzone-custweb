import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import SubCategoryTabs from './SubCategoryTabs';

describe('SubCategoryTabs', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockReset();
  });

  it('should render 2 button and none of them is selected', () => {
    const subCategories = [{ id: '1', name: 'sub-1' }, { id: '2', name: 'sub-2' }];
    const props = { subCategories, onChange };

    const wrapper = shallow(<SubCategoryTabs {...props} />);

    expect(wrapper.find(Button)).toHaveLength(2);

    const firstBtn = wrapper.find(Button).at(0);
    expect(firstBtn.prop('variant')).toBe('text');
    expect(firstBtn.children().text()).toBe('sub-1');

    const secondBtn = wrapper.find(Button).at(1);
    expect(secondBtn.prop('variant')).toBe('text');
    expect(secondBtn.children().text()).toBe('sub-2');
  });

  it('should render 2 button and one of them is selected', () => {
    const selectedSubCategoryId = '1';
    const selectedSubCategory = { id: '1', name: 'sub-1' };
    const subCategories = [selectedSubCategory, { id: '2', name: 'sub-2' }];
    const props = { subCategories, selectedSubCategoryId, onChange };

    const wrapper = shallow(<SubCategoryTabs {...props} />);

    expect(wrapper.find(Button)).toHaveLength(2);

    const firstBtn = wrapper.find(Button).at(0);
    expect(firstBtn.prop('variant')).toBe('contained');
    expect(firstBtn.children().text()).toBe('sub-1');

    const secondBtn = wrapper.find(Button).at(1);
    expect(secondBtn.prop('variant')).toBe('text');
    expect(secondBtn.children().text()).toBe('sub-2');
  });

  it('should render 1 button with correct onChange prop', () => {
    const selectedSubCategory = { id: '1', name: 'sub-1' };
    const subCategories = [selectedSubCategory];
    const props = { subCategories, onChange };

    const wrapper = shallow(<SubCategoryTabs {...props} />);
    const btn = wrapper.find(Button).at(0);
    btn.simulate('click');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(selectedSubCategory.id, 'selectedSubCategoryId');
  });
});
