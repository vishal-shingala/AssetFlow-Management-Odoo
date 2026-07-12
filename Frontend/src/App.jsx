import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { LoadingSpinner } from './components/ui/LoadingSpinner.jsx'
import { Toaster } from 'react-hot-toast'
function App() {
  return (
    <>
      <div className="app-layout">
        
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>

      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;

