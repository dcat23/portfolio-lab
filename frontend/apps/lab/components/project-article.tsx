'use client';

import { Project } from '@feature/lab-client/server';
import { cn } from '@feature/ui/lib/utils';
import { ExternalLink, GitFork, Github, Sparkles, Star } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  project: Project;
  index: number;
  children?: ReactNode;
}

export function ProjectArticle({ project, index }: Props) {
  return (
    <article
      key={project.id}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card/40 p-6 sm:p-7 glass transition-all duration-400 active:scale-[0.99] hover-lift hover:border-primary/40 hover:bg-card/70 animate-fade-in-up",
        project.featured
          ? "sm:col-span-2 lg:col-span-2 border-primary/30 bg-gradient-to-br from-primary/8 via-card/50 to-primary/8"
          : "border-border/60",
        project.featured && !("highlight" in project && project.highlight) && "sm:col-span-2 lg:col-span-1",
      )}
      style={{ animationDelay: `${(index % 6) * 100 + 200}ms` }}
    >
      {project.featured && (
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 animate-pulse-glow">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-medium">
            Featured
          </span>
        </div>
      )}

      {/* Status indicator */}
      <div
        className={cn(
          "absolute right-5 top-5 flex items-center gap-2.5",
          project.featured && "top-5",
        )}
      >
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full transition-shadow duration-300",
            project.status === "shipped" && "bg-primary shadow-sm shadow-primary/50",
            project.status === "in-progress" && "bg-yellow-500 animate-pulse shadow-sm shadow-yellow-500/50",
            project.status === "archived" && "bg-muted-foreground",
          )}
        />
        <span className="font-mono text-xs text-muted-foreground">{project.status}</span>
      </div>

      <div
        className={cn(
          "mb-5 font-mono text-xs text-muted-foreground",
          project.featured && "mt-10",
        )}
      >
        {project.year}
      </div>

      <h3
        className={cn(
          "mb-3 font-bold tracking-tight transition-all duration-300 group-hover:text-gradient",
          project.featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
        )}
      >
        {project.title}
      </h3>

      <p
        className={cn(
          "mb-5 text-sm leading-relaxed text-muted-foreground",
          project.featured ? "line-clamp-3" : "line-clamp-2",
        )}
      >
        {project.description}
      </p>

      <div className="mb-5 flex items-center gap-5 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 transition-colors group-hover:text-yellow-500">
          <Star className="h-3.5 w-3.5" />
          {project.stars}
        </span>
        <span className="flex items-center gap-1.5 transition-colors group-hover:text-foreground">
          <GitFork className="h-3.5 w-3.5" />
          {project.forks}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border/80 bg-secondary/60 px-2.5 py-1 font-mono text-xs text-secondary-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-all duration-300 group/link"
          onClick={(e) => e.stopPropagation()}
        >
          <Github className="h-4 w-4 transition-transform group-hover/link:scale-110" />
          <span className="underline-animate">source</span>
        </a>
        {project.homepage && (
          <a
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs text-primary hover:text-foreground transition-all duration-300 group/link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4 transition-transform group-hover/link:scale-110 group-hover/link:rotate-12" />
            <span className="underline-animate">live</span>
          </a>
        )}
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary via-primary/80 to-transparent transition-all duration-500 group-hover:w-full" />
    </article>
  );
}

export default ProjectArticle;
