"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Search } from "lucide-react";
import { Button } from "./ui/button";

export default function Nav() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 dark:bg-neutral-950/80 border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="font-semibold tracking-tight text-lg">IdeaOasis</Link>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white dark:bg-neutral-900">
            <Search size={16} />
            <input className="bg-transparent outline-none text-sm w-44" placeholder="Search ideas..." />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="dark:hidden" size={18} />
            <Moon className="hidden dark:block" size={18} />
          </Button>
          <Link href="/admin"><Button size="sm">Admin</Button></Link>
        </div>
      </div>
    </header>
  );
}
