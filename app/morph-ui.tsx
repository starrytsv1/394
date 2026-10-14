'use client';

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { MorphIcon, type IconInput } from 'morphicons/react';

type MorphLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  from: IconInput;
  to: IconInput;
  iconSize?: number;
  children: ReactNode;
};

type MorphButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  from: IconInput;
  to: IconInput;
  iconSize?: number;
  children?: ReactNode;
};

export function MorphLink({ from, to: _to, iconSize = 17, children, className = '', ...props }: MorphLinkProps) {
  return <a
    {...props}
    className={`${className} morph-link`.trim()}
  >
    {children}
    <span className="morph-cue" aria-hidden="true">
      <MorphIcon icon={from} reducedMotion="always" size={iconSize} strokeWidth={1.8}/>
    </span>
  </a>;
}

export function MorphButton({ from, to: _to, iconSize = 20, children, className = '', ...props }: MorphButtonProps) {
  return <button
    {...props}
    className={`${className} morph-button`.trim()}
  >
    {children}
    <MorphIcon icon={from} reducedMotion="always" size={iconSize} strokeWidth={1.8}/>
  </button>;
}
