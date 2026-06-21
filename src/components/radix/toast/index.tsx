import { RadixToastProps } from '@/components/radix/toast/types';
import { Toast } from 'radix-ui';
import * as React from 'react';
import './styles.css';

export function RadixToast({ ...props }: RadixToastProps) {
  const [open, setOpen] = React.useState(false);
  const [eventDate, setEventDate] = React.useState(new Date());
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <Toast.Provider swipeDirection="right" {...props}>
      <button
        className="Button large violet"
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setEventDate(oneWeekAway(new Date()));
            setOpen(true);
          }, 100);
        }}
      >
        Add to calendar
      </button>

      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">Scheduled: Catch up</Toast.Title>
        <Toast.Description asChild>
          <time className="ToastDescription" dateTime={eventDate.toISOString()}>
            {prettyDate(eventDate)}
          </time>
        </Toast.Description>
        <Toast.Action className="ToastAction" asChild altText="Goto schedule to undo">
          <button className="Button small green">Undo</button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
}

function oneWeekAway(date: Date) {
  const now = new Date(date);
  const inOneWeek = now.setDate(now.getDate() + 7);
  return new Date(inOneWeek);
}

function prettyDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
}
