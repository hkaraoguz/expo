import type { NavigationState } from '../react-navigation/native';

export function includePlaceholderRoutes<State extends NavigationState>(
  state: State,
  descriptors: Record<
    string,
    { route?: { key: string | undefined; name: string; params?: object | undefined } }
  >
): State {
  const focusedKey = state.routes[state.index]?.key;
  const routes = state.routeNames.map((name) => {
    const route = state.routes.find((route) => route.name === name) ?? descriptors[name]?.route;
    return { ...route, key: route?.key ?? name, name } as State['routes'][number];
  });

  return {
    ...state,
    index: Math.max(
      0,
      routes.findIndex((route) => route.key === focusedKey)
    ),
    routes,
  };
}
