'use client';

import { memo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/common/Card';
import { formatRelativeTime } from '@/utils/format';
import type { Activity } from '@/types';

interface RecentActivitiesProps {
  activities: Activity[];
}

export const RecentActivities = memo(function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <ul className="space-y-4" aria-label="Recent activities">
        {activities.length === 0 ? (
          <li className="text-sm text-slate-500 dark:text-slate-400">No recent activities</li>
        ) : (
          activities.slice(0, 8).map((activity) => (
            <li key={activity.id} className="flex gap-3">
              <div
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  activity.type === 'project' ? 'bg-indigo-500' : 'bg-green-500'
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">{activity.description}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
});
