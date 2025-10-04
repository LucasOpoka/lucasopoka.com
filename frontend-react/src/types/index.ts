// Global type definitions for the application

export interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

export interface NavigationItem {
  path: string;
  label: string;
}
