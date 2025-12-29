// src/App.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Calendar from './pages/Calendar';
import Navbar from './components/Navbar';

// Layout that provides contexts to all routes
const RootLayout = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Outlet />
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
            <Outlet />
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