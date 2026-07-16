import Navbar from "./Navbar";
import { SITE_AUTHOR } from "../lib/config";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar />
      <main>{children}</main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-24 bg-white dark:bg-nav-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} {SITE_AUTHOR}
            </p>
            <div className="flex gap-6 text-xs text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Email</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition">RSS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
