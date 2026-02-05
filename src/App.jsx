// src/App.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Loading from './components/Loading';

// Lazy load pages for performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Notes = lazy(() => import('./pages/Notes'));
const Calendar = lazy(() => import('./pages/Calendar'));

// Layout that provides contexts to all routes
const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <Login /> },
      {
        element: (
          <>
            <Navbar />
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/notes', element: <Notes /> },
          { path: '/calendar', element: <Calendar /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}