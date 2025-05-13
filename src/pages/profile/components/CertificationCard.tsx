import { useI18n } from '../../../i18n';
import { UserCertificationModel } from '../../../models/UserCertificationModel';
import { AlertTriangle, Check } from 'lucide-react';

type Props = {
  cert: UserCertificationModel;
};

function CertificationCard({ cert }: Props) {
  const { t } = useI18n();

  return (
    <div className="bg-input/60 rounded-lg p-3 flex justify-between items-center">
      <div className="flex items-start">
        {cert.status === 'active' ? (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white mr-2 mt-1">
            <Check className="w-3 h-3" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-2 mt-1">
            <AlertTriangle className="w-3 h-3" />
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {cert.certification_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('profile.certifications.expires')}: {cert.expiration_date}
          </p>
        </div>
      </div>
      {cert.status === 'active' ? (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
          {t('profile.certifications.valid')}
        </span>
      ) : (
        <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
          {t('profile.certifications.renewSoon')}
        </button>
      )}
    </div>
  );
}

export default CertificationCard;
