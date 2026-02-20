import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { ForecastPage } from './pages/ForecastPage';
import { MapaChuvasRS } from './pages/MapaChuvasRS';
import { CalendarioFeriados } from './pages/CalendarioFeriados';
import { HistoricoClima2025 } from './pages/HistoricoClima2025';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mapa-chuvas-rs" element={<MapaChuvasRS />} />
          <Route path="/calendario-feriados" element={<CalendarioFeriados />} />
          <Route path="/historico-2025" element={<HistoricoClima2025 />} />
          <Route path="/forecast/:city" element={<ForecastPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
