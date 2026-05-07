import { Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { useLocation, useParams, type Params } from 'react-router-dom';

type LazyPageComponent = LazyExoticComponent<ComponentType> & {
  preload?: () => Promise<{ default: ComponentType }>;
};

type PreloadContext = {
  params: Readonly<Params<string>>;
  pathname: string;
};

type LazyRouteProps = {
  component: LazyPageComponent;
  preload?: (context: PreloadContext) => Promise<unknown> | unknown;
};

type PreloadRecord =
  | { status: 'pending'; promise: Promise<void>; error?: undefined }
  | { status: 'success'; promise: Promise<void>; error?: undefined }
  | { status: 'error'; promise: Promise<void>; error: unknown };

const preloadedRoutes = new Map<string, PreloadRecord>();

function RouteContent({ component: Component, preload }: LazyRouteProps) {
  const params = useParams();
  const location = useLocation();
  const routeKey = `${location.pathname}:${JSON.stringify(params)}`;
  let record = preloadedRoutes.get(routeKey);

  if (!record) {
    const promise = Promise.all([
      Component.preload?.(),
      preload?.({ params, pathname: location.pathname }),
    ])
      .then(() => undefined)
      .catch((error) => {
        const failedRecord = preloadedRoutes.get(routeKey);
        if (failedRecord) {
          preloadedRoutes.set(routeKey, { ...failedRecord, status: 'error', error });
        }
      });

    record = { status: 'pending', promise };
    preloadedRoutes.set(routeKey, record);
    promise.then(() => {
      const current = preloadedRoutes.get(routeKey);
      if (current?.status === 'pending') {
        preloadedRoutes.set(routeKey, { ...current, status: 'success' });
      }
    });
  }

  if (record.status === 'pending') throw record.promise;
  if (record.status === 'error') throw record.error;

  return <Component />;
}

export default function LazyRoute(props: LazyRouteProps) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <RouteContent {...props} />
    </Suspense>
  );
}

function RouteFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <p>Cargando vista...</p>
    </div>
  );
}
