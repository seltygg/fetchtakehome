import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import SignUpPage from './pages/SignUpPage';
import { useAuth } from './context/AuthContext';
import type { ReactElement } from 'react';

function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/search/:page?" element={
          <PrivateRoute>
            <SearchPageWithPageParam />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function SearchPageWithPageParam() {
  const { page } = useParams();
  return <SearchPage pageParam={page} />;
}

export default App;
