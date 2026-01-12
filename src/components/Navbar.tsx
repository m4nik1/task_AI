"use client";
import { Button } from "./ui/button";
import { Calendar, LogOut, LogIn, UserCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [userSession, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function getSession() {
        const session = await fetch("/api/checkSession", { method: "GET" });
          const resData = await session.json();
          setSession(resData.data);
      console.log("user session status: ", userSession);
    }
    getSession();
  }, [setSession, userSession]);

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setSession(null);
          router.push('/');
        }
      }
    });
  }

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex h-16 items-center px-6 justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Task AI</span>
        </Link>

        <div className="flex items-center gap-3">
          {!userSession ? (
            <Button asChild size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Link href="/signIn">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          ) : (
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <UserCircle className="h-7 w-7" />
              </Button>
              <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-in-out z-50">
                <div className="bg-popover border border-border rounded-lg shadow-lg p-1 overflow-hidden">
                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:text-red-400 dark:hover:text-red-300 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
