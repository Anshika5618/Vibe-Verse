import Image from "next/image";

const dotPattern = (
  <div className="grid grid-cols-8 gap-2 p-8 h-full w-full place-content-center bg-gray-50 dark:bg-gray-800/60">
    {Array.from({ length: 32 }).map((_, i) => (
      <span key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
    ))}
  </div>
);

function CardBody({ title, description, tags }) {
  return (
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="text-base font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-start justify-between">
        <span className="flex-1">{title}</span>
        <span className="ml-2 shrink-0">↗</span>
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
        {description}
      </p>
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectCard({ title, description, image, tags, link = "#", horizontal }) {
  const wrapperClass =
    "group block h-full bg-white dark:bg-nav-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300";

  if (horizontal) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="group block">
        <div className={`${wrapperClass} flex flex-col md:flex-row`}>
          <div className="relative md:w-1/2 h-64 overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              dotPattern
            )}
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <CardBody title={title} description={description} tags={tags} />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <div className={`${wrapperClass} flex flex-col`}>
        <div className="relative aspect-video overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            dotPattern
          )}
        </div>
        <CardBody title={title} description={description} tags={tags} />
      </div>
    </a>
  );
}
