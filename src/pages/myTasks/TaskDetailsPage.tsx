import { AlertTriangle, ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { AirportMap } from '../equipmentSearch/components/AirportMap';
import { useEffect, useState } from 'react';
import { TaskModel } from '../../models/TaskModel';
import axiosInstance from '../../utils/axiosConfig';
import { formatDate } from '../../utils/dateUtils';

const statusOptions = [
  { label: 'Assigned', value: 'assigned' },
  { label: 'Started', value: 'started' },
  { label: 'Parked', value: 'parked' },
  { label: 'Completed', value: 'completed' },
];

function TaskDetailsPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { taskId } = useParams<{ taskId: string }>();

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [estimatedCompletion, setEstimatedCompletion] = useState<
    string | undefined
  >();
  const [task, setTask] = useState<TaskModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isTaskUpdating, setIsTaskUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, []);

  // TODO: Show error message
  // TODO: When changing status, disable previous statuses since we can't change them back
  useEffect(() => {
    console.error(error);
  }, [error]);

  const fetchTask = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        '/maintenance-portal/maintenance-management/my-tasks?include_completed=true'
      );
      const data = response.data as TaskModel[];
      const task = data.find((task) => task.id === parseInt(taskId || ''));
      if (!task) {
        setError('Task not found');
      } else {
        setTask(task);
        setSelectedStatus(task.status);

        setProgress(
          {
            assigned: 0,
            started: 25,
            parked: 50,
            completed: 100,
          }[task.status] || 0
        );
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to fetch the task. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: string) => {
    setEstimatedCompletion(date);
  };

  const handleBack = () => {
    navigate('/my-tasks');
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  const handleUpdateTask = () => {
    // Based on the selected status we need to hit the relevent API endpoint
    // if (selectedStatus === 'started') {
    //   Call /maintenance-portal/maintenance-management/start-maintenance/{maintenance_id}
    // } else if (selectedStatus === 'parked') {
    //   Call /maintenance-portal/maintenance-management/park-maintenance/{maintenance_id}
    // } else if (selectedStatus === 'completed') {
    //   Call /maintenance-portal/maintenance-management/complete-maintenance/{maintenance_id}
    // }

    if (selectedStatus !== task?.status) {
      const endpointMap: { [key: string]: string } = {
        started: `/maintenance-portal/maintenance-management/start-maintenance/${task?.id}`,
        parked: `/maintenance-portal/maintenance-management/park-maintenance/${task?.id}`,
        completed: `/maintenance-portal/maintenance-management/complete-maintenance/${task?.id}`,
      };

      const endpoint = endpointMap[selectedStatus];
      if (endpoint) {
        setIsTaskUpdating(true);
        setError(null);
        axiosInstance
          .post(endpoint)
          .then(() => {
            fetchTask();
          })
          .catch((error) => {
            console.error('Error updating task status:', error);
            setError(
              'Failed to update the task status. Please try again later.'
            );
          })
          .finally(() => {
            setIsTaskUpdating(false);
          });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <div className="px-4 pt-4 pb-6 overflow-auto h-full bg-background">
          <button className="flex items-center mb-4">
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="h-4 w-24 bg-input rounded animate-pulse"></span>
          </button>

          {/* Task details card */}
          <div className="bg-card rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-6 w-32 bg-input rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-input rounded-full animate-pulse"></div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 pb-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-1">
                  <div className="h-4 w-20 bg-input rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-input rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-input rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-input rounded animate-pulse"></div>
              </div>
              <div className="w-full bg-input rounded-full h-1.5 mb-4 animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-24 bg-input rounded animate-pulse"></div>
              <div className="h-[300px] w-full bg-input rounded animate-pulse"></div>
            </div>
          </div>

          {/* Update details card */}
          <div className="bg-card rounded-lg p-4 mb-4 space-y-4">
            <div className="h-6 w-32 bg-input rounded animate-pulse"></div>
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="h-4 w-20 bg-input rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-input rounded animate-pulse"></div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="h-4 w-36 bg-input rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-input rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-10 w-full bg-input rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="px-4 py-6 h-full bg-background">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Task Not Found</h1>
        </div>
        <div className="bg-red-900/30 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-400">
              The requested equipment could not be found.
            </p>
          </div>
        </div>
        <button
          onClick={handleBack}
          className="w-full mt-4 bg-[#4285f4] hover:bg-blue-700 py-2 rounded-md transition-colors"
        >
          Return to My Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black h-full bg-background">
      <div className="px-4 pt-4 pb-6 overflow-auto h-full">
        <button onClick={handleBack} className="flex items-center mb-4">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>{t('myTasks.backToMyTasks')}</span>
        </button>
        <div className="bg-card rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold mr-2">
              {task.equipment.type_name}
            </h1>

            <div
              className={`px-3 py-1 rounded-full capitalize flex items-center justify-center text-white text-xs font-medium ${
                task.status === 'started'
                  ? 'bg-blue-500'
                  : task.status === 'assigned'
                  ? 'bg-yellow-700'
                  : task.status === 'parked'
                  ? 'bg-purple-500'
                  : task.status === 'completed'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            >
              {task.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 pb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t('myTasks.task.class')}
              </p>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {task.equipment.equipment_class}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('myTasks.task.equipmentId')}
              </p>
              <p className="font-medium">{task.equipment_id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('myTasks.task.reportedIssue')}
              </p>
              <p className="font-medium">{task.maintenance_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('myTasks.task.severity')}
              </p>
              <p className="font-medium">{task.priority}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('myTasks.task.location')}
              </p>
              <p className="font-medium">{task.terminal.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t('myTasks.task.dueDate')}
              </p>
              <p className="font-medium">{formatDate(task.end_time)}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {t('myTasks.task.taskProgress')}
              </p>
              <p className="font-medium">{progress}%</p>
            </div>
            {progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-background">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground">
              {t('myTasks.task.locationOnMap')}
            </p>
            <div className="h-[300px] w-full">
              <AirportMap
                airportName={t('search.map.title')}
                markers={[
                  {
                    id: 'ATF-0023',
                    type: 'PT',
                    position: [-79.6218, 43.6767] as [number, number],
                    color: '#8b5cf6',
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 mb-4 space-y-4">
          <h1 className="text-lg font-semibold mr-2">
            {t('myTasks.updateDetails')}
          </h1>
          <form className="space-y-5">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="taskStatus" className="text-muted-foreground">
                  {t('myTasks.task.status')}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full bg-input border capitalize border-border rounded-md px-4 py-2 flex items-center justify-between"
                  >
                    <span>{`${selectedStatus}`}</span>
                    <ChevronDown className="w-5 h-5" />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                      {statusOptions.map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          disabled={status.value === task?.status}
                          onClick={() => handleStatusChange(status.value)}
                          className={`w-full text-left px-4 py-3 hover:bg-input/60 rounded-md capitalize disabled:opacity-50 ${
                            selectedStatus === status.value ? 'bg-input/60' : ''
                          }`}
                        >
                          {`${status.label}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="taskStatus" className="text-muted-foreground">
                  {t('myTasks.task.estimatedCompletion')}
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-input border border-border rounded-md px-4 py-2"
                  value={estimatedCompletion}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleUpdateTask();
              }}
              disabled={
                !selectedStatus || !estimatedCompletion || isTaskUpdating
              }
              className="w-full bg-blue-500 py-2 rounded-md transition-colors disabled:opacity-60 text-white flex items-center justify-center"
            >
              {isTaskUpdating ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                t('myTasks.task.saveUpdates')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
