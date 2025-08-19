import type { MyTask } from "@/utils/map-progress-to-tasks";
import { useMyTasks } from "@/hooks/use-my-tasks"; // path to your hook file

type Props = {
  userId?: number | string;
  progressUpdates: any[] | undefined;
  productUserAssigns: any[] | undefined;
  dayKeys: string[];
  isLoadingProgress?: boolean;
  isLoadingAssign?: boolean;
  emptyText?: string;
  onOpen?: (task: MyTask) => void;
};

export default function MyTasksAssignedContainer(props: Props) {
  const {
    list, // final merged + sorted tasks
    loading, // combined loading
  } = useMyTasks({
    userId: props.userId,
    progressUpdates: props.progressUpdates,
    productUserAssigns: props.productUserAssigns,
    dayKeys: props.dayKeys,
    isLoadingProgress: props.isLoadingProgress,
    isLoadingAssign: props.isLoadingAssign,
  });

  return (
    <MyTasksAssignedList
      tasks={list}
      loading={loading}
      emptyText={props.emptyText}
      onOpen={props.onOpen}
    />
  );
}

// import your presentational component (next file)
import MyTasksAssignedList from "./TaskAssignedList";
