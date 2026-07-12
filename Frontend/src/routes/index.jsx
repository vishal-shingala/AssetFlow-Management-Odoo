import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import { GlobalError } from '../components/error/GlobalError.jsx';
import { NotFound } from '../components/error/NotFound.jsx';

// Import routes from features

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <GlobalError />, 
    children: [
      // Spread the routes from different features
      
      {
        path: '*', // Catch-all route for 404s
        element: <NotFound />,
      },
    ],
  },
]);
