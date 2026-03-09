"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  href?: string;
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
  children?: ReactNode;
  activeClassName?: string;
  pendingClassName?: string;
  [key: string]: any;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, to, href, children, ...props }, ref) => {
    const pathname = usePathname();
    const targetHref = href || to;
    const isActive = pathname === targetHref;
    const isPending = false;

    const resolvedClassName = typeof className === 'function'
      ? className({ isActive, isPending })
      : cn(className, isActive && activeClassName, isPending && pendingClassName);

    return (
      <Link
        ref={ref}
        href={targetHref}
        className={resolvedClassName}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
