import { useI18n } from '../../../i18n';
import { TaskModel } from '../../../models/TaskModel';
import TaskListItem from './TaskListItem';
import TaskListItemSkeleton from './TaskListItemSkeleton';

interface TaskListProps {
  tasks: TaskModel[];
  isLoading?: boolean;
  error?: string | null;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4 last:mb-6">
      {isLoading ? (
        <>
          {Array.from({ length: 5 }, (_, index) => (
            <TaskListItemSkeleton key={index} />
          ))}
        </>
      ) : tasks.length > 0 ? (
        <>
          {tasks.map((item) => {
            const progress =
              {
                assigned: 0,
                started: 25,
                parked: 50,
                completed: 100,
              }[item.status] || 0;

            return (
              <TaskListItem
                key={item.id}
                id={item.id}
                equipmentId={item.equipment_id}
                issue={item.maintenance_type}
                location={item.terminal?.location || 'Unknown'}
                dueDate={item.end_time}
                taskProgress={progress}
                status={item.status}
                equipmentType={item.equipment.type_name || 'Unknown'}
                equipmentClass={item.equipment.equipment_class}
                // onReserve={onReserve} // Uncomment and implement if needed
              />
            );
          })}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p className="text-sm">{t('myTasks.noTasks')}</p>
        </div>
      )}
    </div>
  );
}
