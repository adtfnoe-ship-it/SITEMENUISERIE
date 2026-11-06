import { Component, StrictMode, lazy, Suspense, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PhotosProvider } from './lib/photos';

const AdminApp = lazy(() => import('./admin/AdminApp.tsx'));

const isAdmin =
  window.location.pathname === '/admin' ||
  window.location.pathname.startsWith('/admin/');

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: 'monospace', padding: '2rem', color: '#c00', background: '#fff0f0', minHeight: '100vh' }}>
          <h2 style={{ marginBottom: '1rem' }}>Erreur de rendu</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {isAdmin ? (
        <Suspense
          fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
              <div style={{ width: 32, height: 32, border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          }
        >
          <PhotosProvider>
            <AdminApp />
          </PhotosProvider>
        </Suspense>
      ) : (
        <App />
      )}
    </ErrorBoundary>
  </StrictMode>,
);
