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
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-2">{project.pName}</h2>
        <p className="text-gray-600 mb-4">{project.briefDes}</p>
        {loading ? (
          <div className="text-center py-8">Loading details...</div>
        ) : details ? (
          <>
            <div className="mb-2">
              <span className="font-semibold">Description:</span>
              <div className="text-gray-800 mt-1 whitespace-pre-line">{details.wDescription}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Best Technologies:</span>
              <div className="text-gray-800 mt-1">{details.bestTech}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Software Requirements:</span>
              <div className="text-gray-800 mt-1">{details.softReq}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Hardware Requirements:</span>
              <div className="text-gray-800 mt-1">{details.hardReq}</div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-red-500">Failed to load details.</div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsModal; 