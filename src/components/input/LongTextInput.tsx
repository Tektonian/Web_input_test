import React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

interface LongTextInputProps {
  control: any;
  name: string;
  label: string;
}

const LongTextInput: React.FC<LongTextInputProps> = ({ control, name, label }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextField {...field} label={label} multiline rows={4} fullWidth variant="outlined" />
    )}
  />
);

export default LongTextInput;
