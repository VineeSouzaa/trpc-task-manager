import { ComponentProps } from 'react';

export type RadixSwitchProps = {
  id: string;
  ariaLabelledby: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
} & ComponentProps<'div'>;
