import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaProjectDiagram,
  FaChartBar,
  FaExclamationTriangle,
} from "react-icons/fa";
import { adminAPI } from "../services/api";
import AdminLayout from "./AdminLayout";

const AdminDashboardPage: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [projectsByDomain, setProjectsByDomain] = useState<
    Array<{ domain: string; count: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [usersResponse, projectsResponse, domainsResponse] =
          await Promise.all([
            adminAPI.getUsersCount(),
            adminAPI.getProjectsCount(),
            adminAPI.getProjectsByDomain(),
          ]);

        // Users & Projects API return plain numbers
        setTotalUsers(typeof usersResponse === "number" ? usersResponse : 0);
        setTotalProjects(
          typeof projectsResponse === "number" ? projectsResponse : 0
        );

        // Convert domains (object -> array) if needed
        if (
          domainsResponse &&
          typeof domainsResponse === "object" &&
          !Array.isArray(domainsResponse)
        ) {
          const formatted = Object.entries(domainsResponse).map(
            ([domain, count]) => ({
              domain,
              count: Number(count),
            })
          );
          setProjectsByDomain(formatted);
        } else {
          setProjectsByDomain(domainsResponse ?? []);
        }
      } catch (error: any) {
        setError(
          `API Error: ${error.message || "Failed to load dashboard data"}`
        );
        setTotalUsers(0);
        setTotalProjects(0);
        setProjectsByDomain([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold">
                  Error Loading Dashboard
                </h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
              >
                Retry
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalUsers}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaUsers className="text-blue-600 text-xl" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Projects
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {totalProjects}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FaProjectDiagram className="text-purple-600 text-xl" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Domains
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {projectsByDomain.length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FaChartBar className="text-green-600 text-xl" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Projects by Domain Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <FaChartBar className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Projects by Domain
                </h2>
              </div>

              {projectsByDomain.length > 0 ? (
                <div className="space-y-4">
                  {projectsByDomain.map((domain, index) => (
                    <motion.div
                      key={domain.domain}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">
                          {domain.domain}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(
                                (domain.count /
                                  Math.max(
                                    ...projectsByDomain.map((d) => d.count)
                                  )) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-600 w-8 text-right">
                          {domain.count}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaChartBar className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>No domain data available</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
