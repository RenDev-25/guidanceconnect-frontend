import React from 'react';
import FormInput from './FormInput';

/**
 * 
 * @param {Object} props 
 */
const DatePicker = (props) => {
  return (
    <FormInput 
      type="date" 
      {...props} 
    />
  );
};

export default DatePicker;