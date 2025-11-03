import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 32a96 96 0 1 0 96 96a96.11 96.11 0 0 0-96-96Zm0 176a80 80 0 1 1 80-80a80.09 80.09 0 0 1-80 80Z" />
        <path d="M168 128h-32v32a8 8 0 0 1-16 0v-40a8 8 0 0 1 8-8h40a8 8 0 0 1 0 16Z" />
        <path d="M112.51 152.8l-3.02 10.38a8 8 0 0 1-15.48-4.5l34-116a8 8 0 0 1 15 4.84L120.65 112H152a8 8 0 0 1 0 16h-34.5l-6.36 21.87a8 8 0 0 1 2.37 8.24a8 8 0 0 1-8 .69Z" />
      </g>
    </svg>
  );
}
