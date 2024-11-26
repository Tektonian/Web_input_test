import React from 'react';
import * as Select from '@radix-ui/react-select';
import { Controller } from 'react-hook-form';

interface SelectInputProps {
  control: any;
  name: string;
  label: string;
  options: { label: string; value: string }[];
}

const SelectInput: React.FC<SelectInputProps> = ({ control, name, label, options }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div>
        <label>{label}</label>
        <Select.Root value={field.value} onValueChange={field.onChange}>
          <Select.Trigger>
            <Select.Value placeholder="Select an option" />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    )}
  />
);

export default SelectInput;
