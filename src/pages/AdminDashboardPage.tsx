import React, { useEffect, useState } from 'react';
import { getUserCount, getProjectCount, getProjectsDomainCounts } from '../services/api';
import AdminLayout from './AdminLayout';

const AdminDashboardPage: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [domainCounts, setDomainCounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUserCount(),
      getProjectCount(),
      getProjectsDomainCounts()
    ])
      .then(([users, projects, domains]) => {
        setUserCount(users.count);
        setProjectCount(projects.count);
        setDomainCounts(domains);
        setError(null);
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-semibold text-blue-600 mb-2">Total Users</div>
              <div className="text-4xl font-bold text-gray-900">{userCount}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-semibold text-purple-600 mb-2">Total Projects</div>
              <div className="text-4xl font-bold text-gray-900">{projectCount}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Projects by Domain</h2>
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Domain</th>
                  <th className="py-2 px-4">Project Count</th>
                </tr>
              </thead>
              <tbody>
                {domainCounts.map((d: any) => (
                  <tr key={d.domain} className="border-t">
                    <td className="py-2 px-4">{d.domain}</td>
                    <td className="py-2 px-4">{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage; 