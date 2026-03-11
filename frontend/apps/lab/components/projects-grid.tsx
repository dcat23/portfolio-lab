
import { getProjects } from "@feature/lab-client/server"
import ProjectFilters from "./project-filters"
import ProjectsList from "./projects-list"

// const projects = [
//   {
//     id: 0,
//     title: "EinUI",
//     description:
//       "A collection of beautiful, ready-made Liquid Glass UI components you can preview, copy, and drop into any web app. Built on Tailwind, shadcn/ui, and Radix UI primitives.",
//     tags: ["TypeScript", "Next.js 16", "shadcn", "Radix UI", "Tailwind"],
//     status: "in-progress",
//     year: "2025",
//     stars: 34,
//     forks: 1,
//     url: "https://github.com/dcat23/einui",
//     homepage: "https://ui.eindev.ir",
//     featured: true,
//     highlight: true,
//   },
//   {
//     id: 1,
//     title: "EinBioGPT",
//     description:
//       "An intelligent web application built with Next.js, Tailwind CSS, and OpenAI's GPT models. Generates engaging and personalized bios for social media platforms.",
//     tags: ["TypeScript", "Next.js", "GPT", "LangChain"],
//     status: "shipped",
//     year: "2023",
//     stars: 17,
//     forks: 8,
//     url: "https://github.com/dcat23/einbiogpt",
//     homepage: "https://bio.eindev.ir/",
//     featured: true,
//   },
//   {
//     id: 2,
//     title: "JavaScript Playground",
//     description:
//       "A collection of JavaScript code snippets, algorithms, and mini-projects for learning and reference purposes.",
//     tags: ["JavaScript", "Algorithms", "Snippets"],
//     status: "shipped",
//     year: "2020",
//     stars: 19,
//     forks: 5,
//     url: "https://github.com/dcat23/javascript-playground",
//     featured: false,
//   },
//   {
//     id: 3,
//     title: "Next.js 16 Docker Starter",
//     description:
//       "A batteries-included starter for building Next.js 16.1.0 apps with App Router, PNPM, Tailwind v4+, Next-Auth v5, and multi-stage Docker setup.",
//     tags: ["Next.js 16.1.0", "Docker", "Tailwind v4"],
//     status: "in-progress",
//     year: "2025",
//     stars: 9,
//     forks: 4,
//     url: "https://github.com/dcat23/next16-docker-tw4-starter",
//     homepage: "https://nextjs-16-docker.vercel.app",
//     featured: true,
//   },
//   {
//     id: 4,
//     title: "Awesome Clubhouses",
//     description:
//       "Curated list of resources for Clubhouse, the voice-based social network where people come together to talk, listen and learn.",
//     tags: ["Python", "Awesome List", "Social"],
//     status: "archived",
//     year: "2022",
//     stars: 41,
//     forks: 8,
//     url: "https://github.com/dcat23/awesome-clubhouse",
//     homepage: "https://devincatuns.github.io/awesome-clubhouse/",
//     featured: false,
//   },
//   {
//     id: 5,
//     title: "LLM Practice",
//     description:
//       "A self-hosted personal chatbot API with FastAPI. Interact with Llama2 and other open-source LLMs for natural language conversations.",
//     tags: ["Python", "FastAPI", "Llama2", "MCP"],
//     status: "shipped",
//     year: "2023",
//     stars: 13,
//     forks: 3,
//     url: "https://github.com/dcat23/llm-practice",
//     featured: false,
//   },
//   {
//     id: 6,
//     title: "Hand-Build Linux",
//     description:
//       "A minimal, customizable Linux distribution built from scratch using the Linux kernel, BusyBox, and Syslinux bootloader.",
//     tags: ["Shell", "Linux", "Docker"],
//     status: "in-progress",
//     year: "2025",
//     stars: 8,
//     forks: 1,
//     url: "https://github.com/dcat23/handbuilt-linux",
//     featured: true,
//   },
//   {
//     id: 7,
//     title: "Next.js AppDir Template",
//     description:
//       "An all-inclusive Next.js web application template showcasing seamless integration of Next.js, Docker, MongoDB, and Tailwind CSS.",
//     tags: ["TypeScript", "Next.js", "Docker", "MongoDB"],
//     status: "shipped",
//     year: "2023",
//     stars: 19,
//     forks: 6,
//     url: "https://github.com/dcat23/nextjs-appdir-docker",
//     featured: false,
//   },
// ]


export async function ProjectsGrid() {
  const { data: projects, error } = await getProjects();

  if (error) {
    console.error('[lab] Error fetching projects:', error.body);
  }

  return (
    <section id="projects" className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-14 flex flex-col gap-6 sm:gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3 animate-fade-in-up">
            <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">Artifacts</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Open Source Projects</h2>
          </div>

          <ProjectFilters />
        </div>

        <ProjectsList projects={projects} />
      </div>
    </section>
  )
}
