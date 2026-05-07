import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type RouteModule = { default: ComponentType };
type LazyPageComponent = LazyExoticComponent<ComponentType> & {
  preload?: () => Promise<RouteModule>;
};

export function lazyPage(importer: () => Promise<RouteModule>) {
  let promise: Promise<RouteModule> | undefined;
  const preload = () => {
    promise ??= importer();
    return promise;
  };
  const Component = lazy(preload) as LazyPageComponent;
  Component.preload = preload;
  return Component;
}
