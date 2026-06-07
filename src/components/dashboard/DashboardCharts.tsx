'use client';

import { memo, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import type { Project, Task } from '@/types';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#64748b'];

interface DashboardChartsProps {
  projects: Project[];
  tasks: Task[];
}

export const DashboardCharts = memo(function DashboardCharts({ projects, tasks }: DashboardChartsProps) {
  const projectStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  const taskStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((t) => {
      counts[t.status] = (counts[t.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [tasks]);

  const completionTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      completed: Math.floor(tasks.filter((t) => t.status === 'Completed').length * (0.5 + i * 0.1)),
      pending: Math.floor(tasks.filter((t) => t.status !== 'Completed').length * (1 - i * 0.08)),
    }));
  }, [tasks]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={projectStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            >
              {projectStatusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Task Completion</CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={taskStatusData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="lg:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle>Completion Trend</CardTitle>
        </CardHeader>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={completionTrend}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
});
