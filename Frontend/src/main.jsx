import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { AppProvider } from './context/AppContext';
import { router } from './routes/index.jsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// PrimeReact & PrimeFlex styles
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

import 'primeflex/primeflex.css';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true, inputStyle: 'filled' }}>
      <AppProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </AppProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
