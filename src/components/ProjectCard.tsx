import React from "react";
import { Project } from "../types";
import { FaStar, FaHeart } from "react-icons/fa";

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (project: Project) => void;
}

const DIFFICULTY_MAP: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, isFavorite = false, onFavoriteToggle }) => {
  return (
    <div
      className="card p-6 cursor-pointer group transition-transform duration-200 hover:scale-105"
      onClick={() => onClick && onClick(project)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
            {project.pName}
          </h3>
          <p className="text-sm text-gray-500">{project.domain}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {DIFFICULTY_MAP[project.diffLevel]}
          </span>
          <button
            className="ml-2 focus:outline-none"
            onClick={e => {
              e.stopPropagation();
              onFavoriteToggle && onFavoriteToggle(project);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500 transition-colors duration-200"} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.briefDes}
      </p>
      <div className="flex items-center space-x-1">
        {[...Array(project.rating)].map((_, i) => (
          <FaStar key={i} className="text-yellow-500" />
        ))}
        <span className="ml-2 text-gray-700 text-sm">{project.rating}</span>
      </div>
    </div>
  );
};

export default ProjectCard; 