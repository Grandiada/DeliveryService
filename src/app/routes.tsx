import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ConnectedRouter } from 'connected-react-router';

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

export const history = createBrowserHistory();

class Router extends React.Component<{}, {}> {
  public render() {
    return (
      <ConnectedRouter history={history}>
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
      </ConnectedRouter>
    );
  }
}

export default Router;
