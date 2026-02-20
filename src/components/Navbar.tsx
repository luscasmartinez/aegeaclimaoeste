import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Cloud, LogOut, Shield, Map, Calendar, BarChart3 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-lg border-b border-blue-100 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition">
            <Cloud className="w-8 h-8" />
            <span className="font-bold text-xl">Clima Oeste</span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              to="/mapa-chuvas-rs"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <Map className="w-5 h-5" />
              <span className="hidden sm:inline">Mapa Chuvas RS</span>
            </Link>
            <Link
              to="/calendario-feriados"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:inline">Calendário</span>
            </Link>
            <Link
              to="/historico-2025"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Histórico 2025</span>
            </Link>
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Login Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
