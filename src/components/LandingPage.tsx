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
  Layout,
  Shield,
  Smartphone,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-24">
        
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-primary/10 bg-primary/5 px-6 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Task Management</span>
            </div>

            <h1 className="mb-8 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Master Your Workflow{" "}
              <span className="relative inline-block text-primary decoration-4 underline-offset-4">
                Effortlessly
                {/* Underline svg or simple border could go here if needed, but text-primary is strong enough */}
              </span>
            </h1>

            <p className="mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Stop juggling chaos. Visualize your day with our intelligent Gantt charts, 
              organize with AI assistance, and stay ahead of your schedule without the stress.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link href="/signUp">
                <Button size="lg" className="h-12 min-w-[160px] text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid w-full max-w-3xl grid-cols-3 gap-8 border-t border-border pt-12 md:gap-16">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl font-black text-foreground">10x</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Faster Planning</div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl font-black text-foreground">AI</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Smart Assistant</div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl font-black text-foreground">100%</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Power-Packed Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Built for professionals who value clarity and efficiency.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <FeatureCard 
              icon={<Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              title="Smart Scheduling"
              description="Visual Gantt chart timeline shows your tasks across the day for intuitive planning."
              colorClass="bg-blue-100 dark:bg-blue-900/20"
            />

            {/* Feature 2 */}
            <FeatureCard 
              icon={<MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
              title="AI Assistant"
              description="Chat naturally with AI to create, modify, and get insights about your daily tasks."
              colorClass="bg-purple-100 dark:bg-purple-900/20"
            />

            {/* Feature 3 */}
            <FeatureCard 
              icon={<BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />}
              title="Visual Timeline"
              description="Get a bird's-eye view of your entire day. Spot gaps and overlaps instantly."
              colorClass="bg-green-100 dark:bg-green-900/20"
            />

            {/* Feature 4 */}
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
              title="Drag & Drop"
              description="Fluid interface lets you reorder and prioritize tasks with simple drag gestures."
              colorClass="bg-amber-100 dark:bg-amber-900/20"
            />

            {/* Feature 5 */}
            <FeatureCard 
              icon={<Clock className="h-6 w-6 text-red-600 dark:text-red-400" />}
              title="Time Tracking"
              description="Set durations and let the system automatically calculate perfect end times."
              colorClass="bg-red-100 dark:bg-red-900/20"
            />

            {/* Feature 6 */}
            <FeatureCard 
              icon={<CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />}
              title="Task Mastery"
              description="Track completion status and celebrate your wins as you check off daily goals."
              colorClass="bg-teal-100 dark:bg-teal-900/20"
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Trusted By (Placeholder styled as benefits) */}
      <section className="border-y border-border px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
           <div className="grid gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-full bg-primary/10 p-4">
                   <Layout className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Clean Interface</h3>
                <p className="text-muted-foreground">Distraction-free design helps you focus on what matters most.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-full bg-primary/10 p-4">
                   <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Private & Secure</h3>
                <p className="text-muted-foreground">Your data is yours. We prioritize security and privacy above all.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="mb-6 rounded-full bg-primary/10 p-4">
                   <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Mobile Ready</h3>
                <p className="text-muted-foreground">Access your tasks from anywhere, on any device, at any time.</p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-primary text-primary-foreground px-6 py-16 text-center shadow-2xl md:px-12">
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Ready to Get Organized?
            </h2>
            <p className="mb-10 text-lg opacity-90 md:text-xl">
              Join the future of productivity. No credit card required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signUp">
                <Button size="lg" variant="secondary" className="h-14 min-w-[180px] text-lg font-bold shadow-md">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-6 py-12 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">Task AI</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Task AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, colorClass }: { icon: React.ReactNode, title: string, description: string, colorClass: string }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${colorClass}`}>
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
