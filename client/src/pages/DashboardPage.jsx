// client/src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import ProjectCard from '../components/project/ProjectCard';
import Button from '../components/ui/Button';

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project deletion
  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((p) => p._id !== projectId));
  };

  if (isLoading) {
    return (
      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Loading projects...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            My Projects
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <Link to='/projects/new'>
          <Button variant='primary'>+ New Project</Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6'>
          {error}
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm'>
          <div className='text-6xl mb-4'>📋</div>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
            No projects yet
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Create your first project to get started
          </p>
          <Link to='/projects/new'>
            <Button variant='primary'>+ Create First Project</Button>
          </Link>
        </div>
      )}
    </main>
  );
}

export default DashboardPage;
