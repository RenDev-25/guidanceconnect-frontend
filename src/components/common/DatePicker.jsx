
import React from 'react';
import FormInput from './FormInput';

/**
 * Reusable Date Picker with built-in form styling and error handling.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string} props.value
 * @param {function} props.onChange
 * @param {string} [props.error]
 * @param {string} [props.helpText]
 */

const DatePicker = (props) => {
  return (
    <FormInput
      {...props}
      type="date"
    />
  );
};

export default DatePicker;
