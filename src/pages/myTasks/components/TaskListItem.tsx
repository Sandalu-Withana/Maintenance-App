import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../i18n';
import { formatDate } from '../../../utils/dateUtils';

type props = {
  id: number;
  equipmentId: number;
  issue: string;
  location: string;
  dueDate: string;
  status: string;
  equipmentType: string;
  equipmentClass: string;
  taskProgress: number;
};

export default function TaskListItem({
  id,
  equipmentId,
  issue,
  location,
  dueDate,
  taskProgress,
  status,
  equipmentType,
  equipmentClass,
}: props) {
  const { t } = useI18n();
  const navigate = useNavigate();

  const onClickViewDetails = () => {
    navigate(`/tasks/${id}`);
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold mr-2">{equipmentType}</h1>
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {equipmentClass}
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full capitalize flex items-center justify-center text-white text-xs font-medium ${
            status === 'started'
              ? 'bg-blue-500'
              : status === 'assigned'
              ? 'bg-yellow-700'
              : status === 'parked'
              ? 'bg-purple-500'
              : status === 'completed'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          {status}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {t('myTasks.task.equipmentId')}
          </p>
          <p className="font-medium">{equipmentId}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {t('myTasks.task.reportedIssue')}
          </p>
          <p className="font-medium">{issue}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{t('myTasks.task.location')}</p>
          <p className="font-medium">{location}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{t('myTasks.task.dueDate')}</p>
          <p className="font-medium">{formatDate(dueDate)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {t('myTasks.task.taskProgress')}
          </p>
          <p className="font-medium">{taskProgress}%</p>
        </div>
        {taskProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-background">
            <div
              className="h-1.5 rounded-full bg-primary"
              style={{ width: `${taskProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      <button
        className="w-full bg-[#4285f4] hover:bg-[#357ae8] text-white py-2 rounded-full transition-colors font-semibold disabled:opacity-60"
        onClick={onClickViewDetails}
      >
        {t('myTasks.task.viewDetails')}
      </button>
    </div>
  );
}
