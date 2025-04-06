'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation';

const navItems = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
  '/projects': {
    name: 'projects',
  }
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              const selected = pathname === path || pathname.includes(name);

              return (
                <Link
                  key={path}
                  href={path}
                  className={`transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 overflow-hidden ${selected ? "w-6" : "w-auto"
                    }`}
                >
                  <span
                    className={`transform transition-all duration-300 ${selected ? "opacity-0 scale-0" : "opacity-100 scale-100"
                      }`}
                  >
                    {name}
                  </span>
                  <span
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 ${selected ? "opacity-100 scale-100" : "opacity-0 scale-0"
                      }`}
                  >
                    &#x2022;
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
