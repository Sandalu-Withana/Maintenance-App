import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { UserCertificationModel } from '../../models/UserCertificationModel';
import axiosInstance from '../../utils/axiosConfig';
import CertificationCardSkeleton from './components/CertificationCardSkeleton';
import CertificationCard from './components/CertificationCard';

export default function ProfilePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userCertifications, setUserCertifications] = useState<
    UserCertificationModel[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserCertifications();
  }, []);

  const fetchUserCertifications = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/certifications/current-user`);
      setUserCertifications(response.data);
    } catch (error) {
      console.error('Error fetching user certifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <main className="flex flex-col flex-1 overflow-hidden px-4 pt-4 pb-0">
        <div className="flex justify-between items-center sticky top-0 z-10 mb-4 ">
          <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleSettingsClick}
              className="flex items-center bg-card px-4 py-2 rounded-full text-sm"
            >
              <Settings className="w-4 h-4 mr-1" />
              {t('profile.settings')}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm"
            >
              <LogOut className="w-4 h-4" />
              {/* {t('profile.logout')} */}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto pb-6">
          {/* Personal Information Card */}
          <div className="bg-card rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {t('profile.personalInfo')}
            </h2>

            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                <img
                  src={
                    'https://i.ibb.co/RG1T5MfX/67359259-10157357653992486-5288470571040899072-n.jpg'
                  }
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src =
                      'https://via.placeholder.com/150?text=JS';
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {/* {userData.jobTitle} */}
                Ground Service Operator
              </p>
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs mt-1">
                {/* {userData.location} */}
                YYZ
              </div>
            </div>

            <div className="border-t border-border my-4"></div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.employeeId')}
                </p>
                <p>{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.email')}
                </p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.phone')}
                </p>
                <p>
                  {/* {userData.phone} */}
                  +1 (416) 555-1234
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('profile.startDate')}
                </p>
                <p>{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Certifications Card */}
          <div className="bg-card rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">
              {t('profile.certifications.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('profile.certifications.subtitle')}
            </p>

            <div className="space-y-3">
              {isLoading ? (
                <CertificationCardSkeleton />
              ) : userCertifications.length > 0 ? (
                userCertifications.map((cert, index) => (
                  <CertificationCard cert={cert} key={index} />
                ))
              ) : (
                <div className="flex items-center justify-center text-muted-foreground">
                  {t('profile.certifications.noCertifications')}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-card rounded-lg p-4 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">
              {t('profile.logoutConfirm.title')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('profile.logoutConfirm.message')}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={cancelLogout}
                className="flex-1 bg-zinc-800 text-white py-2 rounded-md"
              >
                {t('profile.logoutConfirm.cancel')}
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white py-2 rounded-md"
              >
                {t('profile.logoutConfirm.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
