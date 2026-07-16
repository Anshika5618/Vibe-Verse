import Link from "next/link";
import Image from "next/image";
import { SITE_AUTHOR } from "../lib/config";

const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";

function CardContent({ author, date, title, description, tags, titleSize = "text-base" }) {
  return (
    <div className="p-5 flex-1 flex flex-col">
      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">
        {author || SITE_AUTHOR} • {date}
      </p>
      <h3 className={`${titleSize} font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-start justify-between`}>
        <span className="flex-1">{title}</span>
        <span className="ml-2">↗</span>
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
        {description}
      </p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
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

export default function BlogCard({ slug, title, description, image, date, author, tags = [], featured, horizontal }) {

  // Featured card
  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="group block h-full">
        <div className="h-full flex flex-col bg-white dark:bg-nav-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
          <div className="relative flex-1 min-h-48 overflow-hidden">
            <Image
              src={image || defaultImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardContent author={author} date={date} title={title} description={description} tags={tags} titleSize="text-xl" />
        </div>
      </Link>
    );
  }

  // Horizontal card
  if (horizontal) {
    return (
      <Link href={`/blog/${slug}`} className="group block">
        <div className="flex flex-col md:flex-row bg-white dark:bg-nav-dark  rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
          <div className="relative md:w-1/2 h-64 overflow-hidden">
            <Image
              src={image || defaultImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <CardContent author={author} date={date} title={title} description={description} tags={tags} titleSize="text-lg" />
          </div>
        </div>
      </Link>
    );
  }

  // Regular card
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <div className="h-full flex flex-col bg-white dark:bg-nav-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image || defaultImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent author={author} date={date} title={title} description={description} tags={tags} />
      </div>
    </Link>
  );
}