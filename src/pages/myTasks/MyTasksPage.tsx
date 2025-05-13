import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n';
import { SearchBar } from '../equipmentSearch/components/SearchBar';
import { TaskList } from './components/TaskList';
import { TaskModel } from '../../models/TaskModel';
import axiosInstance from '../../utils/axiosConfig';

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Started', value: 'started' },
  { label: 'Parked', value: 'parked' },
  { label: 'Completed', value: 'completed' },
];

const MyTasksPage = () => {
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);
  const [filteredTasks, setFilteredTasks] = useState<TaskModel[]>([]);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(
          '/maintenance-portal/maintenance-management/my-tasks?include_completed=true'
        );
        const data = response.data as TaskModel[];
        console.log('Fetched tasks:', data);
        setTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);

    const newFilteredTasks = tasks.filter((task) => {
      if (value === 'all') return true;
      return task.status === value;
    });
    setFilteredTasks(newFilteredTasks);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <main className="flex flex-col flex-1 overflow-hidden pt-4 pb-0">
        <div className="sticky top-0 z-10 mb-4 space-y-4">
          <h1 className="text-2xl px-4 font-bold">{t('myTasks.title')}</h1>
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hidden scroll-pl-4 px-4">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`px-4 py-1 snap-start rounded-full ${
                  selectedFilter === option.value
                    ? 'bg-primary text-white'
                    : 'bg-card'
                }`}
                onClick={() => handleFilterChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="px-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('search.searchPlaceholder')}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto px-4">
          <TaskList tasks={filteredTasks} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default MyTasksPage;
