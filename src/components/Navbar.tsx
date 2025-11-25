"use client";
import { Button } from "./ui/button";
import { LayoutDashboard, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Navbar() {
  const viewOptions = ["Day"];
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
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="text-lg tracking-tight">Task AI</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1">
            {viewOptions.map((view, index) => (
              <Button
                key={index}
              variant="default"
                size="sm"
              className="px-3 py-1 text-sm"
              >
                {view}
              </Button>
            ))}
          </div>
          {!userSession ? (
            <Button asChild variant="default" size="sm" className="gap-2">
              <Link href="/signIn">
                <LogIn className="h-3.5 w-3.5" />
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
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
