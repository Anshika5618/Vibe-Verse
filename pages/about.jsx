import Image from "next/image";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { SITE_NAME, SITE_URL, SITE_AUTHOR } from "../lib/config";

const skills = [
  "Product & UX Design",
  "Design Systems",
  "Prototyping (Figma)",
  "User Research",
  "Front-end (React / Next.js)",
  "Cross-functional Collaboration",
];

const experience = [
  {
    role: "Senior Product Designer",
    place: "Vibe Verse Studio",
    period: "2022 — Present",
    description:
      "Leading end-to-end design for web products, from early discovery through shipped, polished interfaces.",
  },
  {
    role: "UX Designer",
    place: "Freelance",
    period: "2019 — 2022",
    description:
      "Partnered with startups and small teams to design and prototype products across web and mobile.",
  },
];

const education = [
  "B.A. in Graphic Design",
  "Certified UX Design Professional",
];

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description={`Learn more about ${SITE_AUTHOR} and the story behind ${SITE_NAME}.`}
        url={`${SITE_URL}/about`}
      />
      <Layout>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          {/* Header */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-10">
            {SITE_AUTHOR}
          </h1>

          {/* Portrait */}
          <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden mb-12 bg-gray-100 dark:bg-gray-800">
            <Image
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200"
              alt={SITE_AUTHOR}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* About Me */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About Me
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              I&apos;m a passionate and experienced UX designer dedicated to creating
              intuitive and engaging user experiences that meet the needs of my clients
              and their users. I have a strong understanding of design principles and a
              proficiency in design tools, and I&apos;m comfortable working with cross-functional
              teams to bring projects to fruition. I&apos;m confident in my ability to create
              designs that are both visually appealing and functional, and I&apos;m always
              looking for new challenges and opportunities to grow as a designer.
            </p>
          </section>

          {/* Skills */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((job) => (
                <div
                  key={job.role}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-nav-dark p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {job.role} · {job.place}
                    </h3>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Education
            </h2>
            <ul className="space-y-2">
              {education.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Layout>
    </>
  );
}
