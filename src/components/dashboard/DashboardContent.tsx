'use client';

import { memo, useEffect, useState } from 'react';
import { FolderKanban, CheckSquare, CheckCircle2, Clock } from 'lucide-react';
import { Header } from '@/components/common/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { CardSkeleton } from '@/components/common/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { fetchProjects } from '@/store/projectSlice';
import { fetchAllTasks } from '@/store/taskSlice';
import { selectProjects, selectTasks } from '@/store/selectors';
import { dashboardService } from '@/services/auth.service';
import type { Activity } from '@/types';

export const DashboardContent = memo(function DashboardContent() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const tasks = useAppSelector(selectTasks);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([
        dispatch(fetchProjects({ pageSize: 100 })),
        dispatch(fetchAllTasks()),
        dashboardService.getActivities().then(setActivities),
      ]);
      setLoading(false);
    };
    load();
  }, [dispatch]);

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <div>
      <Header title="Dashboard" description="Overview of your projects and tasks" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Total Projects" value={projects.length} icon={FolderKanban} color="indigo" />
            <StatCard title="Total Tasks" value={tasks.length} icon={CheckSquare} color="yellow" />
            <StatCard title="Completed Tasks" value={completedTasks} icon={CheckCircle2} color="green" />
            <StatCard title="Pending Tasks" value={pendingTasks} icon={Clock} color="red" />
          </>
        )}
      </div>

      {!loading && (
        <>
          <div className="mb-8">
            <DashboardCharts projects={projects} tasks={tasks} />
          </div>
          <RecentActivities activities={activities} />
        </>
      )}
    </div>
  );
});
