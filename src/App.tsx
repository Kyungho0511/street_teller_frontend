import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Root from './pages/Root';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Cluster from './pages/Cluster';
import NotFound from './pages/NotFound';
import Report from './pages/Report';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: '/cluster', element: <Cluster /> },
    ]
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}