"use client";
import { Button } from "./ui/button";
import { Calendar, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Navbar() {
  const [userSession, setSession] = useState(null);

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
    console.log("Signing out");
    // Add actual sign out logic here later if needed
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect('/signIn')
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
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
