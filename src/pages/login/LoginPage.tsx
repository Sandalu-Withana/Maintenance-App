import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import logoDark from '../../assets/logo_light.png';
import logoLight from '../../assets/logo_dark.svg';

interface Airport {
  code: string;
  name: string;
}

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { login, user, accessToken, isAuthenticated } = useAuth();

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAirport, setSelectedAirport] = useState<Airport>({
    code: 'YYZ',
    name: 'Toronto Pearson International Airport',
  });
  const [showAirportDropdown, setShowAirportDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const airports: Airport[] = [
    { code: 'YYZ', name: 'Toronto Pearson International Airport' },
    {
      code: 'YUL',
      name: 'Montréal-Pierre Elliott Trudeau International Airport',
    },
    { code: 'YVR', name: 'Vancouver International Airport' },
    { code: 'YYC', name: 'Calgary International Airport' },
    { code: 'YHZ', name: 'Halifax Stanfield International Airport' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    login({ employeeId, password })
      .then(() => {
        setIsLoading(false);
        console.log('Login successful', user, accessToken, isAuthenticated);
        navigate('/equipment/search');
      })
      .catch((err) => {
        setIsLoading(false);
        console.error('Login error 2:', err);
        setError(err?.response?.data?.detail?.msg || t('login.loginFailed'));
      });
  };

  const selectAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    setShowAirportDropdown(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4 flex items-center">
          <img src={logoLight} alt="Logo" className="hidden dark:block h-10" />
          <img src={logoDark} alt="Logo" className="block dark:hidden h-10" />
        </div>

        {/* Portal Title */}
        <h2 className="text-blue-400 text-lg mb-8">
          {t('login.maintenancePortal')}
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="employeeId" className="block mb-2 text-sm">
              {t('login.employeeId')}
            </label>
            <input
              type="text"
              id="employeeId"
              placeholder={'operator.demo@aircanada.com'}
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full bg-input border border-border rounded-md px-4 py-3"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm">
              {t('login.password')}
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input border border-border rounded-md px-4 py-3"
            />
          </div>

          <div className="hidden">
            <label htmlFor="airport" className="block mb-2 text-sm">
              {t('login.selectAirport')}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAirportDropdown(!showAirportDropdown)}
                className="w-full bg-input border border-border rounded-md px-4 py-3 flex items-center justify-between"
              >
                <span>{`${selectedAirport.code}: ${selectedAirport.name}`}</span>
                <ChevronDown className="w-5 h-5" />
              </button>

              {showAirportDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                  {airports.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => selectAirport(airport)}
                      className="w-full text-left px-4 py-3 hover:bg-input/60"
                    >
                      {`${airport.code}: ${airport.name}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full transition-colors"
          >
            {isLoading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>
      </div>
    </div>
  );
}
