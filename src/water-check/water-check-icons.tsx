import type * as React from "react";

type WaterCheckIconProps = {
  className?: string;
};

function IconFrame({ className, children }: WaterCheckIconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function PlayIcon(props: WaterCheckIconProps) {
  return (
    <IconFrame {...props}>
      <path d="m9 7 8 5-8 5Z" fill="currentColor" stroke="none" />
    </IconFrame>
  );
}

export function SparkleIcon(props: WaterCheckIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 3c.7 4.8 2.2 6.3 7 7-4.8.7-6.3 2.2-7 7-.7-4.8-2.2-6.3-7-7 4.8-.7 6.3-2.2 7-7Z" />
      <path d="M18.5 16.5c.25 1.6.75 2.1 2.5 2.5-1.75.4-2.25.9-2.5 2.5-.25-1.6-.75-2.1-2.5-2.5 1.75-.4 2.25-.9 2.5-2.5Z" />
    </IconFrame>
  );
}

export function PlusIcon(props: WaterCheckIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 6v12M6 12h12" />
    </IconFrame>
  );
}

export function CheckInIcon(props: WaterCheckIconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="12" cy="12" r="7" strokeDasharray="4 3" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </IconFrame>
  );
}

export function ArrowRightIcon(props: WaterCheckIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M5 12h14M14 7l5 5-5 5" />
    </IconFrame>
  );
}

export function ArrowUpRightIcon(props: WaterCheckIconProps) {
  return (
    <IconFrame {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </IconFrame>
  );
}
