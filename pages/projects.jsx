import Layout from "../components/Layout";
import SEO from "../components/SEO";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../lib/projects";
import { SITE_URL } from "../lib/config";

export default function Projects() {
  return (
    <>
      <SEO
        title="Projects"
        description="A collection of design and development projects."
        url={`${SITE_URL}/projects`}
      />
      <Layout>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              PROJECTS
            </h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              List Project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects
              .filter((p) => !p.horizontal)
              .slice(0, 2)
              .map((project) => (
                <ProjectCard key={project.slug} {...project} />
              ))}
          </div>

          {projects
            .filter((p) => p.horizontal)
            .map((project) => (
              <div key={project.slug} className="mt-6">
                <ProjectCard {...project} />
              </div>
            ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {projects
              .filter((p) => !p.horizontal)
              .slice(2)
              .map((project) => (
                <ProjectCard key={project.slug} {...project} />
              ))}
          </div>
        </div>
      </Layout>
    </>
  );
}
