import React, { useEffect, useState } from 'react';
import { getProjects, addProject } from '../services/api';
import AdminLayout from './AdminLayout';

const domains = ['Web', 'AI', 'ML', 'IoT', 'Game', 'Android'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const AdminProjectsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    domain: '',
    difficulty: '',
    rating: '',
    github: '',
    tags: '',
  });
  const [success, setSuccess] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);
    addProject(form)
      .then(() => {
        setSuccess('Project added successfully!');
        setForm({ title: '', description: '', domain: '', difficulty: '', rating: '', github: '', tags: '' });
      })
      .catch(() => setError('Failed to add project'))
      .finally(() => setLoading(false));
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Projects Management</h1>
      <form onSubmit={handleAddProject} className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">Title</label>
          <input name="title" value={form.title} onChange={handleFormChange} className="input-field mb-4" required />
          <label className="block mb-2 font-semibold">Domain</label>
          <select name="domain" value={form.domain} onChange={handleFormChange} className="input-field mb-4" required>
            <option value="">Select Domain</option>
            {domains.map((d) => <option key={d}>{d}</option>)}
          </select>
          <label className="block mb-2 font-semibold">Difficulty</label>
          <select name="difficulty" value={form.difficulty} onChange={handleFormChange} className="input-field mb-4" required>
            <option value="">Select Difficulty</option>
            {difficulties.map((d) => <option key={d}>{d}</option>)}
          </select>
          <label className="block mb-2 font-semibold">Rating</label>
          <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleFormChange} className="input-field mb-4" required />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Description</label>
          <textarea name="description" value={form.description} onChange={handleFormChange} className="input-field mb-4" required />
          <label className="block mb-2 font-semibold">GitHub Link</label>
          <input name="github" value={form.github} onChange={handleFormChange} className="input-field mb-4" />
          <label className="block mb-2 font-semibold">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleFormChange} className="input-field mb-4" />
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>{loading ? 'Adding...' : 'Add Project'}</button>
          {success && <div className="text-green-600 mt-2">{success}</div>}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProjectsPage; 