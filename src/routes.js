import React, { Fragment, lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import AuthGuard from './components/Auth/AuthGuard'
import GuestGuard from './components/Auth/GuestGuard'
import Loader from './components/Loader/Loader'
import { BASE_URL } from './config/constant'
import AdminLayout from './layouts/AdminLayout'
import {
  ADMINISTRATION_BRANDS,
  ADMINISTRATION_BRANDS_CREATE,
  ADMINISTRATION_BRANDS_EDIT,
  ADMINISTRATION_CLIENTS,
  ADMINISTRATION_CLIENTS_CREATE,
  ADMINISTRATION_CLIENTS_EDIT,
  ADMINISTRATION_EQUIPAMENTS,
  ADMINISTRATION_EQUIPAMENTS_CREATE,
  ADMINISTRATION_EQUIPAMENTS_EDIT,
  ADMINISTRATION_MANAGER_EXTRACT_NUBANK,
  ADMINISTRATION_MANAGER_USER_CREATE,
  ADMINISTRATION_MANAGER_USER_EDIT,
  ADMINISTRATION_MODELS,
  ADMINISTRATION_MODELS_CREATE,
  ADMINISTRATION_MODELS_EDIT,
  ADMINISTRATION_PIECES,
  ADMINISTRATION_PIECES_CREATE,
  ADMINISTRATION_PIECES_EDIT,
  ADMINISTRATION_SEE_ALL_PERMISSIONS,
  ADMINISTRATION_SERVICES,
  ADMINISTRATION_SERVICES_CREATE,
  ADMINISTRATION_SERVICES_EDIT,
  DASHBOARD,
  FINANCIAL_SEE_ALL_EXPENSES,
  FINANCIAL_SEE_ALL_INCOME,
  MANAGER_SERVICE_ORDER,
  MANAGER_SERVICE_ORDER_CREATE,
  MANAGER_SERVICE_ORDER_EDIT,
  MANAGER_SERVICE_ORDER_VIEW,
} from './layouts/typePath'

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment
        const Layout = route.layout || Fragment
        const Component = route.component

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </Layout>
              </Guard>
            )}
          />
        )
      })}
    </Switch>
  </Suspense>
)

const routes = [
  {
    exact: true,
    guard: GuestGuard,
    path: '/auth/signin',
    component: lazy(() => import('./views/auth/signin/SignIn1')),
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/auth/signup',
    component: lazy(() => import('./views/auth/signup/SignUp1')),
  },
  // {
  //     exact: true,
  //     path: '/auth/signin-2',
  //     component: lazy(() => import('./views/auth/signin/SignIn2'))
  // },
  // {
  //     exact: true,
  //     path: '/auth/signup-2',
  //     component: lazy(() => import('./views/auth/signup/SignUp2'))
  // },
  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: DASHBOARD,
        component: lazy(() => import('./views/dashboard/DashDefault')),
      },
      {
        exact: true,
        path: ADMINISTRATION_CLIENTS,
        component: lazy(() => import('./views/modules/administration/clients')),
      },
      {
        exact: true,
        path: ADMINISTRATION_CLIENTS_CREATE,
        component: lazy(() =>
          import('./views/modules/administration/clients/create'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_CLIENTS_EDIT,
        component: lazy(() =>
          import('./views/modules/administration/clients/edit'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_PIECES,
        component: lazy(() => import('./views/modules/administration/pieces')),
      },
      {
        exact: true,
        path: ADMINISTRATION_PIECES_CREATE,
        component: lazy(() =>
          import('./views/modules/administration/pieces/create'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_PIECES_EDIT,
        component: lazy(() =>
          import('./views/modules/administration/pieces/edit'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_SEE_ALL_PERMISSIONS,
        component: lazy(() =>
          import('./views/modules/administration/permissions'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_MANAGER_USER_CREATE,
        component: lazy(() =>
          import('./views/modules/administration/permissions/create'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_MANAGER_USER_EDIT,
        component: lazy(() =>
          import('./views/modules/administration/permissions/edit'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_SERVICES,
        component: lazy(() =>
          import('./views/modules/administration/services'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_SERVICES_CREATE,
        component: lazy(() =>
          import('./views/modules/administration/services/create'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_SERVICES_EDIT,
        component: lazy(() =>
          import('./views/modules/administration/services/edit'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_EQUIPAMENTS,
        component: lazy(() =>
          import('./views/modules/administration/equipaments'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_EQUIPAMENTS_CREATE,
        component: lazy(() =>
          import('./views/modules/administration/equipaments/create'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_EQUIPAMENTS_EDIT,
        component: lazy(() =>
          import('./views/modules/administration/equipaments/edit'),
        ),
      },
      {
        exact: true,
        path: MANAGER_SERVICE_ORDER,
        component: lazy(() =>
          import('./views/modules/manager/seeAllServiceOrder'),
        ),
      },
      {
        exact: true,
        path: MANAGER_SERVICE_ORDER_CREATE,
        component: lazy(() =>
          import('./views/modules/manager/serviceOrder/create'),
        ),
      },
      {
        exact: true,
        path: MANAGER_SERVICE_ORDER_EDIT,
        component: lazy(() =>
          import('./views/modules/manager/serviceOrder/edit'),
        ),
      },
      {
        exact: true,
        path: MANAGER_SERVICE_ORDER_VIEW,
        component: lazy(() => import('./views/modules/manager/serviceOrder')),
      },
      {
        exact: true,
        path: FINANCIAL_SEE_ALL_INCOME,
        component: lazy(() =>
          import('./views/modules/financial/Income/SeeAllIncome'),
        ),
      },
      {
        exact: true,
        path: FINANCIAL_SEE_ALL_EXPENSES,
        component: lazy(() =>
          import('./views/modules/financial/Expenses/SeeAllExpenses'),
        ),
      },
      {
        exact: true,
        path: ADMINISTRATION_MANAGER_EXTRACT_NUBANK,
        component: lazy(() =>
          import('./views/modules/administration/configurations'),
        ),
      },
      {
        exact: true,
        path: '/administration/connections',
        component: lazy(() =>
          import('./views/modules/administration/connections'),
        ),
      },
      {
        exact: true,
        path: '/basic/button',
        component: lazy(() => import('./views/ui-elements/basic/BasicButton')),
      },
      {
        exact: true,
        path: '/basic/badges',
        component: lazy(() => import('./views/ui-elements/basic/BasicBadges')),
      },
      {
        exact: true,
        path: '/basic/breadcrumb',
        component: lazy(() =>
          import('./views/ui-elements/basic/BasicBreadcrumb'),
        ),
      },
      {
        exact: true,
        path: '/basic/collapse',
        component: lazy(() =>
          import('./views/ui-elements/basic/BasicCollapse'),
        ),
      },
      {
        exact: true,
        path: '/basic/tabs-pills',
        component: lazy(() =>
          import('./views/ui-elements/basic/BasicTabsPills'),
        ),
      },
      {
        exact: true,
        path: '/basic/typography',
        component: lazy(() =>
          import('./views/ui-elements/basic/BasicTypography'),
        ),
      },

      {
        exact: true,
        path: '/forms/form-basic',
        component: lazy(() => import('./views/forms/FormsElements')),
      },
      {
        exact: true,
        path: '/tables/bootstrap',
        component: lazy(() => import('./views/tables/BootstrapTable')),
      },

      {
        exact: true,
        path: '/charts/nvd3',
        component: lazy(() => import('./views/charts/nvd3-chart')),
      },
      {
        exact: true,
        path: '/sample-page',
        component: lazy(() => import('./views/extra/SamplePage')),
      },
      {
        path: '*',
        exact: true,
        component: () => <Redirect to={BASE_URL} />,
      },
    ],
  },
]

export default routes
