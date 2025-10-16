/**
 * Dashboard Page (Presentation Layer)
 *
 * Example page showing how to use all layers together.
 */

import { Card, LoadingSpinner } from '@/components/ui';
import { useCurrentUser } from '@/hooks/queries/useUser';

export const DashboardPage = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-600">Error loading dashboard data</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold text-green-600">456</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$12,345</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">New user registration</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">Payment processed</span>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">System update completed</span>
            <span className="text-sm text-gray-500">6 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
