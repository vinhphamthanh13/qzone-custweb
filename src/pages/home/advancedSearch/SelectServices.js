import React from 'react';
import {
  Select, MenuItem, FormControl, InputLabel,
} from '@material-ui/core';
import './SelectServices.scss';

const renderCategories = (categories) => {
  const renderedCategory = [];
  categories.forEach((category) => {
    if (category.subs.length > 0) {
      renderedCategory.push(
        <MenuItem key={category.id} disabled>
          {category.name}
        </MenuItem>,
      );

      category.subs.forEach((subCategory) => {
        if (subCategory.services.length > 0) {
          renderedCategory.push(
            <MenuItem
              disabled
              key={subCategory.id}
              className="select-services__sub-category"
            >
              {subCategory.name}
            </MenuItem>,
          );

          subCategory.services.forEach((service) => {
            renderedCategory.push(
              <MenuItem
                key={service.id}
                value={service.name}
                className="select-services__service"
              >
                {service.name}
              </MenuItem>,
            );
          });
        }
      });
    }
  });
  return renderedCategory;
};

export default function SelectServices({
  onSelectService,
  selectedService,
  categories,
}) {
  const renderedCategory = renderCategories(categories);
  return (
    <FormControl className="select-services">
      <InputLabel htmlFor="select-services-area">Select service</InputLabel>
      <Select
        inputProps={{ id: 'select-services-area' }}
        onChange={onSelectService}
        value={selectedService}
      >
        {renderedCategory}
      </Select>
    </FormControl>
  );
}
