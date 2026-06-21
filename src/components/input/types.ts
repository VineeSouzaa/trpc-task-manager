import { ComponentProps } from "react";

export type InputProps = ComponentProps<'input'> & {
  error?: string;
};
