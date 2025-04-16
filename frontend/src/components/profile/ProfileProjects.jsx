import React from 'react';

export default function ProfileProjects({ projects }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#002B5B]">Projects</h2>
        <button className="text-[#F7931E] hover:text-[#F7931E]/80 transition-colors">
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length === 0 ? (
          <p className="text-[#002B5B]/60 text-center py-4 col-span-2">No projects added yet</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-gray-200 overflow-hidden hover:border-[#F7931E] transition-colors"
            >
              {project.image ? (
                <div className="relative h-48 w-full">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-[#002B5B]/5 flex items-center justify-center">
                  <span className="material-icons text-4xl text-[#002B5B]/40">
                    code
                  </span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-[#002B5B]">{project.name}</h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F7931E] hover:text-[#F7931E]/80 transition-colors"
                    >
                      <span className="material-icons">open_in_new</span>
                    </a>
                  )}
                </div>
                <p className="text-[#002B5B]/80 line-clamp-3">{project.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 