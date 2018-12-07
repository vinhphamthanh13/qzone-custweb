import React from 'react';
import { shallow } from 'enzyme';
import Organisation from './Organisation';

describe('', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Organisation />);
    expect(wrapper.find('div')).toHaveLength(7);
  });
});
