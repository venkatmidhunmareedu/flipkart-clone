import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function FlipkartBagIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M4 8h16l-1.2 12H5.2L4 8z"
        fill="#2874f0"
        stroke="#2874f0"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 8V6.5C8 4.57 9.57 3 11.5 3h1C14.43 3 16 4.57 16 6.5V8"
        stroke="#2874f0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 11.5h6"
        stroke="#ffe500"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14.5" r="1.2" fill="#ffe500" />
    </svg>
  );
}

export function ScooterIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="7" cy="17" r="2.5" stroke="#e53935" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="2.5" stroke="#e53935" strokeWidth="1.5" />
      <path
        d="M9.5 17h5M7 17l2-6h4l2 3h3"
        stroke="#e53935"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 11V8h3"
        stroke="#e53935"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlaneIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M3 12l18-6-4 8 4 4-18-6z"
        fill="#e53935"
        stroke="#e53935"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 14l-2 4"
        stroke="#e53935"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HouseIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SuperCoinIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="9" fill="#ffe500" stroke="#f5a623" strokeWidth="1" />
      <circle cx="12" cy="12" r="6.5" stroke="#f5a623" strokeWidth="0.75" opacity="0.6" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fill="#212121"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        S
      </text>
    </svg>
  );
}

export function UserProfileIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M6 6h15l-1.5 9H7.5L6 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L5 3H2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function SearchMagnifierIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M16 16l5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronRightSmallIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
