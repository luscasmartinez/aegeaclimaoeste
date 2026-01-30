import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Cloud, LogOut, Shield, Map } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition">
            <Cloud className="w-8 h-8" />
            <span className="font-bold text-xl">MeteoInfo</span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              to="/mapa-chuvas-rs"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition"
            >
              <Map className="w-5 h-5" />
              <span className="hidden sm:inline">Mapa Chuvas RS</span>
            </Link>
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
