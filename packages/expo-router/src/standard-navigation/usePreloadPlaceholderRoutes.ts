import { useLayoutEffect } from 'react';

type Route = { key: string; name: string };
type Descriptor = {
  route?: { key?: string };
  options?: { lazy?: boolean };
};

export function usePreloadPlaceholderRoutes({
  routes,
  descriptors,
  preload,
  lazyByDefault,
}: {
  routes: Route[];
  descriptors: Record<string, Descriptor | undefined>;
  preload: (name: string) => void;
  lazyByDefault: boolean;
}) {
  useLayoutEffect(() => {
    for (const route of routes) {
      const descriptor = descriptors[route.key];
      if (descriptor?.route?.key === undefined && !(descriptor?.options?.lazy ?? lazyByDefault)) {
        preload(route.name);
      }
    }
  }, [descriptors, lazyByDefault, preload, routes]);
}
