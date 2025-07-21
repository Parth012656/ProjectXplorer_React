import React from 'react';
import { Project } from '../types';

interface ProjectDetailsModalProps {
  project: Project;
  details: any;
  loading: boolean;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, details, loading, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border-2 border-blue-100">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-3xl font-extrabold mb-2 text-blue-700 border-b-2 border-blue-100 pb-2">{project.pName}</h2>
        <p className="text-gray-700 mb-4 italic">{project.briefDes}</p>
        {loading ? (
          <div className="text-center py-8 text-blue-600 font-semibold">Loading details...</div>
        ) : details ? (
          <div className="space-y-4">
            <div className="mb-2">
              <span className="block text-lg font-bold text-purple-700 mb-1">Description</span>
              <div className="text-gray-800 bg-purple-50 rounded p-2 whitespace-pre-line">{details.wDescription}</div>
            </div>
            <div className="mb-2">
              <span className="block text-lg font-bold text-green-700 mb-1">Best Technologies</span>
              <div className="text-gray-800 bg-green-50 rounded p-2">{details.bestTech}</div>
            </div>
            <div className="mb-2">
              <span className="block text-lg font-bold text-blue-700 mb-1">Software Requirements</span>
              <div className="text-gray-800 bg-blue-50 rounded p-2">{details.softReq}</div>
            </div>
            <div className="mb-2">
              <span className="block text-lg font-bold text-yellow-700 mb-1">Hardware Requirements</span>
              <div className="text-gray-800 bg-yellow-50 rounded p-2">{details.hardReq}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-red-500 font-semibold">Failed to load details.</div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsModal; 