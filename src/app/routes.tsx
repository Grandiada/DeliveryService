import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, MemoryRouter } from 'react-router-dom';


export enum MenuItems {
  GraphManager = '/graph-manager',
}

export interface IRoute {
  path: MenuItems;
  component: React.ComponentType<any>;
  exact: boolean;
}

const defaultPath = MenuItems.GraphManager;

const routes: IRoute[] = [
  {
    component: lazy(() => import(/* webpackChunkName: "GraphManager" */ '../features/GraphManager')),
    exact: true,
    path: MenuItems.GraphManager,
  },
];

class Router extends React.Component<{}, {}> {
  public render() {
    return (
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" render={() => <Redirect to={defaultPath} />} />
            {routes.map((route) => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={() => <div>Route doesnt exsist</div>} />
          </Switch>
        </Suspense>
      </MemoryRouter>
    );
  }
}

export default Router;
