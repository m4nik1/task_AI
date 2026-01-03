"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">AI-Powered Task Management</span>
            </div>

            <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Manage Your Tasks{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Smarter
              </span>
            </h1>

            <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Transform your productivity with AI-powered task management. Visualize
              your day, organize effortlessly, and let AI help you stay on track.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signUp">
                <Button size="lg" className="gap-2 text-base">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signIn">
                <Button size="lg" variant="outline" className="text-base">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">10x</div>
                <div className="text-sm text-muted-foreground">Faster Planning</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">AI</div>
                <div className="text-sm text-muted-foreground">Powered Assistant</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need to Stay Organized
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to help you manage your time effectively
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-xl border border-border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Smart Scheduling</h3>
              <p className="text-muted-foreground">
                Visual Gantt chart timeline shows your tasks across the day for
                easy planning
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-xl border border-border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI Assistant</h3>
              <p className="text-muted-foreground">
                Chat with AI to create, modify, and get insights about your tasks
                naturally
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-xl border border-border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Visual Timeline</h3>
              <p className="text-muted-foreground">
                See your entire day at a glance with our intuitive Gantt chart
                visualization
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-xl border border-border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Drag & Drop</h3>
              <p className="text-muted-foreground">
                Easily reorder and prioritize tasks with intuitive drag and drop
                functionality
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-xl border border-border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Time Tracking</h3>
              <p className="text-muted-foreground">
                Set start times, durations, and automatically calculate end times
                for perfect scheduling
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-xl border border-border bg-card/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Task Status</h3>
              <p className="text-muted-foreground">
                Track completion status and stay on top of your daily goals and
                progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="font-semibold">Task AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Task AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
