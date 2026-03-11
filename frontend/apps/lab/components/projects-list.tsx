'use client';

import { useProjectsStore } from '@feature/lab-client';
import { Project } from '@feature/lab-client/server';
import { ReactNode, useMemo } from 'react';
import ProjectArticle from './project-article';

interface Props {
  projects: Project[]
  children?: ReactNode;
}

export function ProjectsList({ projects }: Props) {
  const filter = useProjectsStore(state => state.filter);
  const filteredProjects = useMemo(() => {
    return filter === "all" ? projects : projects.filter(project => project.status === filter);
  }, [projects, filter])
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map((project, index) => (
        <ProjectArticle key={project.id} project={project} index={index}/>
      ))}
    </div>
  );
}

export default ProjectsList;
