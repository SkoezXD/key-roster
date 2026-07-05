"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Players",
    href: "/players",
  },
  {
    label: "Characters",
    href: "/characters",
  },
  {
    label: "Availability",
    href: "/availability",
  },
  {
    label: "Runs",
    href: "/runs",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-950 px-4 py-6 text-slate-100 md:block">
      <div className="mb-8">
        <Link href="/dashboard" className="text-xl font-bold">
          KeyRoster
        </Link>

        <p className="mt-1 text-sm text-slate-400">
          Mythic+ roster manager
        </p>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}