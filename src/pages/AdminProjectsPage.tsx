import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaProjectDiagram,
  FaPlus,
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaStar,
} 
from "react-icons/fa";
import { adminAPI } from "../services/api";
import AdminLayout from "./AdminLayout";

const domains = ["AI_ML", "Web_Development", "Iot", "Game_Development", "App_development"];

const difficulties = [
  { label: "Beginner", value: 1 },
  { label: "Intermediate", value: 2 },
  { label: "Advance", value: 3 },
];

// 🔧 Helper: map domain → areaId
const getAreaId = (domain: string) => {
  switch (domain) {
    case "AI_ML": return 1;
    case "Web_Development": return 2;
    case "Iot": return 3;
    case "Game_Development": return 4;
    case "App_development": return 5;
    default: return 0;
  }
};

const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const formRef = React.useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    pName: "",
    briefDes: "",
    domain: "",
    diffLevel: 1,
    rating: 1,
    areaId: 0,
    description: {
      wDescription: "",
      softReq: "",
      hardReq: "",
      bestTech: "",
    },
  });

  const loadProjects = async () => {
    setProjectsLoading(true);
    setError(null);
    try {
      const projectsData = await adminAPI.getProjects();
      setProjects(projectsData);
    } catch (error: any) {
      console.error("Projects loading error:", error);
      setError(error.message || "Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  // Reset or clamp currentPage if projects length changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(projects.length / itemsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [projects.length]);

  // Auto hide success after 3 seconds
useEffect(() => {
  if (success) {
    const timer = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(timer);
  }
}, [success]);

// Auto hide error after 3 seconds (optional)
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }
}, [error]);


  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (["wDescription", "softReq", "hardReq", "bestTech"].includes(name)) {
      setForm({
        ...form,
        description: { ...form.description, [name]: value },
      });
    } else if (name === "diffLevel" || name === "rating") {
      setForm({ ...form, [name]: parseInt(value) });
    } else if (name === "domain") {
      setForm({
        ...form,
        domain: value,
        areaId: getAreaId(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({
      pName: "",
      briefDes: "",
      domain: "",
      diffLevel: 1,
      rating: 1,
      areaId: 0,
      description: { wDescription: "", softReq: "", hardReq: "", bestTech: "" },
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      await adminAPI.addProject(form);
      setSuccess("Project saved successfully!");
      resetForm();
      loadProjects();
    } catch (error: any) {
      console.error("Save project error:", error);
      setError(error.message || "Failed to save project");
    } finally { setLoading(false); }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
  
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      await adminAPI.updateProject(editingProject.pId, form);
      setSuccess("Project updated successfully!");
      resetForm();
      loadProjects();
    } catch (error: any) {
      console.error("Update project error:", error);
      setError(error.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteProject = async (pId: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    setError(null);
    try {
      await adminAPI.deleteProject(pId);
      setSuccess("Project deleted successfully!");
      loadProjects();
    } catch (error: any) {
      console.error("Delete project error:", error);
      setError(error.message || "Failed to delete project");
    } finally { setLoading(false); }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setForm({
      pName: project.pName || "",
      briefDes: project.briefDes || "",
      domain: project.domain || "",
      diffLevel: project.diffLevel || 1,
      rating: project.rating || 1,
      areaId: project.areaId || getAreaId(project.domain),
      description: {
        wDescription: project.description?.wDescription || "",
        softReq: project.description?.softReq || "",
        hardReq: project.description?.hardReq || "",
        bestTech: project.description?.bestTech || "",
      },
    });
    setShowForm(true);
  
    // 🔥 Auto-scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  

  const getDifficultyColor = (level: number | undefined | null) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination calculations (keep outside of JSX)
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = currentPage * itemsPerPage;
  const paginatedProjects = projects.slice(startIdx, endIdx);

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FaPlus />
            <span>{showForm ? "Close Form" : "Add Project"}</span>
          </motion.button>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <FaCheck className="text-green-500 flex-shrink-0" />
          <span className="text-green-700">{success}</span>
        </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8" ref={formRef}>
            <form onSubmit={editingProject ? handleUpdateProject : handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input name="pName" value={form.pName} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                <select name="domain" value={form.domain} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select Domain</option>
                  {domains.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select name="diffLevel" value={form.diffLevel} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  {difficulties.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>

              {/* Brief Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description</label>
                <textarea name="briefDes" value={form.briefDes} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>

              {/* Whole Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Whole Description</label>
                <textarea name="wDescription" value={form.description.wDescription} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>

              {/* Software Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Software Required</label>
                <input name="softReq" value={form.description.softReq} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>

              {/* Hardware Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hardware Requirements</label>
                <input name="hardReq" value={form.description.hardReq} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>

              {/* Best Technology */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Best Technology</label>
                <input name="bestTech" value={form.description.bestTech} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex space-x-4">
              <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg">
              {editingProject ? "Update Project" : "Add Project"}
              </button>

                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {projectsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

  {paginatedProjects.map((project) => (
    <React.Fragment key={project.pId}>
      <tr>
        <td className="px-6 py-4">
          <div>
            <div className="font-medium text-gray-900">{project.pName}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{project.briefDes}</div>
          </div>
        </td>
        <td className="px-6 py-4">{project.domain}</td>
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(project.diffLevel)}`}
          >
            {difficulties.find((d) => d.value === project.diffLevel)?.label || "Unknown"}
          </span>
        </td>
        <td className="px-6 py-4 flex items-center space-x-1">
          <FaStar className="text-yellow-400" />
          <span>{project.rating}</span>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => handleEditProject(project)}
            className="text-blue-600 mr-2"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteProject(project.pId)}
            className="text-red-600"
          >
            <FaTrash />
          </button>
        </td>
      </tr>

      {editingProject?.pId === project.pId && (
        <tr>
          <td colSpan={5}>
            <form onSubmit={handleUpdateProject} className="p-4 bg-gray-50 rounded-lg">
              {/* same form fields here but compact */}
            </form>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

              </table>
              {projects.length === 0 && (
                <div className="text-center py-12">
                  <FaProjectDiagram className="text-4xl mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500">Get started by adding your first project.</p>
                </div>
              )}
              {/* Pagination Controls */}
              {projects.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 mr-2 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(Math.ceil(projects.length / itemsPerPage), p + 1))}
                      disabled={currentPage === Math.ceil(projects.length / itemsPerPage)}
                      className={`px-3 py-1 ml-2 rounded ${currentPage === Math.ceil(projects.length / itemsPerPage) ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'}`}
                    >
                      Next
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.max(1, Math.ceil(projects.length / itemsPerPage)) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminProjectsPage;
