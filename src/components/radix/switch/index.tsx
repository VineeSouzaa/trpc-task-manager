import { RadixSwitchProps } from '@/components/radix/switch/types';
import { Switch } from 'radix-ui';
import './styles.css';

export function RadixSwitch({ id, ariaLabelledby, checked, onChange, ...props }: RadixSwitchProps) {
  return (
    <div {...props}>
      <Switch.Root
        id={id}
        aria-labelledby={ariaLabelledby}
        className="SwitchRoot"
        checked={checked}
        onCheckedChange={onChange}
      >
        <Switch.Thumb
          className="SwitchThumb"
          data-state={checked ? 'checked' : 'unchecked'}
          onClick={() => onChange(!checked)}
        />
      </Switch.Root>
    </div>
  );
}
