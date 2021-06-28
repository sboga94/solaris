import React, { useState } from 'react';
import DatePicker from 'react-date-picker';

export default function DateField({onChangeFunc,defaultValue}) {
  const [compValue, setValue] = useState(defaultValue);

  const onChange = (value) => {
    onChangeFunc(value);
    setValue(value);
  }
  return (
    <div>
      <DatePicker
        onChange={onChange}
        value={compValue}
      />
    </div>
  );
}

