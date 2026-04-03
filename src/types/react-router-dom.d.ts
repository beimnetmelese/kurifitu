declare module 'react-router-dom' {
  import type { ComponentType, ReactNode } from 'react';

  export const BrowserRouter: ComponentType<{ children?: ReactNode }>;
  export const Routes: ComponentType<{ children?: ReactNode }>;
  export const Route: ComponentType<Record<string, unknown>>;
  export const Link: ComponentType<{ to: string; children?: ReactNode }>;
  export const Outlet: ComponentType<Record<string, unknown>>;
  export const Navigate: ComponentType<{ to: string; replace?: boolean }>;
  export function useLocation(): { pathname: string };
  export function createBrowserRouter(routes: unknown[]): unknown;
}