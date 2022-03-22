import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthRoute from './AuthRoute';
import routeList from './routeList';
import routeRedirectList from './routeRedirectList';

export default function AppRoute() {
  return (
    <Router>
      <Routes>
        {routeRedirectList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<Navigate to={route.redirect} replace />}
          />
        ))}
        <Route element={<AuthRoute />}>
          {routeList.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}
