import { Link, useRouteError } from 'react-router-dom';


export function GlobalError() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <i className="pi pi-exclamation-triangle w-8 h-8 text-danger"></i>
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">Something went wrong</h1>
        <p className="text-muted mb-6">
          {error?.statusText || error?.message || 'An unexpected error occurred'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
