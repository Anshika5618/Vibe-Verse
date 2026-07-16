import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { SITE_NAME } from "../lib/config";
import { useUser } from "../lib/useUser";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, loading, refresh } = useUser();
const router = useRouter();

async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  refresh();
  router.push('/');
}
  const links = [
    { href: "/", label: "Blog" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-white dark:bg-nav-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-purple-600 text-xs font-bold text-white">
              VV
            </span>
            {SITE_NAME}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />
            {!loading && (
  user ? (
    <div className="flex items-center gap-3">
      <Link href="/blog/new" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
        Write
      </Link>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {user.username}
      </span>
      <button onClick={handleLogout} className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
        Log out
      </button>
    </div>
  ) : (
    <Link href="/login" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
      Log in
    </Link>
  )
)}
          </div>

          {/* Mobile: Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-700 dark:text-gray-300 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
