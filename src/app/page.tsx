import {
  ArrowRight,
  Check,
  Cpu,
  Download,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import FadeIn from "@/components/fade-in";
import { InteractiveMockup } from "@/components/interactive-mockup";
import { NavigationPill } from "@/components/navigation-pill";
import { SiteLogo } from "@/components/site-logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-muted-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden font-sans">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-150 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[60%] rounded-full bg-brand-purple/15 blur-[120px]" />
        <div className="absolute top-[-5%] right-[10%] w-[35%] h-[50%] rounded-full bg-brand-pink/15 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto px-6">
        <FadeIn direction="up" duration={0.8}>
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
              The current way to <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-purple via-brand-pink to-brand-gold">
                build portfolios is broken.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Stop tweaking templates. Folio turns your existing CV / Résumé
              into a stunning, customized, portable portfolio in 60 seconds with
              the power of AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full justify-center max-w-md">
              <Link
                href="#interactive-mockup"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-border text-foreground hover:bg-muted rounded-xl",
                )}
              >
                See It in Action
              </Link>
              <Link
                href="/app"
                className={cn(
                  buttonVariants({ size: "lg", variant: "default" }),
                  "bg-linear-to-r from-brand-purple to-brand-pink hover:opacity-90 text-foreground font-semibold shadow-brand-pink/35 transition-all duration-300 rounded-xl flex items-center gap-2",
                )}
              >
                Try Folio Now - It's Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2} duration={0.8}>
          <InteractiveMockup />
        </FadeIn>
      </section>

      {/* Statistics Section (Social Proof / Validation) */}
      <section
        id="stats"
        className="border-t border-border/30 bg-background py-16 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn direction="up" duration={0.6}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                Why a personal website matters
              </h2>
              <p className="text-muted-foreground/80 text-sm">
                Standard resumes are no longer enough in a competitive
                engineering and design market.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Stat Card 1 */}
            <FadeIn direction="up" delay={0.1} duration={0.6}>
              <div className="flex flex-col items-center md:items-start p-6 bg-card border border-border/30 rounded-2xl text-center md:text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-xl group-hover:bg-brand-purple/10 transition-colors" />
                <div className="mb-4">
                  <Badge className="bg-brand-purple/10 hover:bg-brand-purple/10 text-brand-purple border-brand-purple/20 text-lg px-4 py-1.5 font-bold rounded-xl">
                    71% IMPACT
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Hiring Managers Prefer Portfolios
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  71% of hiring managers are most impressed by personal
                  portfolio websites during the screening phase, giving
                  candidates a massive edge.
                </p>
              </div>
            </FadeIn>

            {/* Stat Card 2 */}
            <FadeIn direction="up" delay={0.2} duration={0.6}>
              <div className="flex flex-col items-center md:items-start p-6 bg-card border border-border/30 rounded-2xl text-center md:text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl group-hover:bg-brand-gold/10 transition-colors" />
                <div className="mb-4">
                  <Badge className="bg-brand-gold/10 hover:bg-brand-gold/10 text-brand-gold border-brand-gold/20 text-lg px-4 py-1.5 font-bold rounded-xl">
                    ONLY 7%
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  The Job Seeker Gap
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Only 7% of job seekers actually have a custom portfolio
                  website live. Building yours instantly sets you in the top
                  tier of candidates.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 md:py-28 max-w-7xl mx-auto px-6 relative z-10"
      >
        <FadeIn direction="up" duration={0.6}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              How Folio Works
            </h2>
            <p className="text-muted-foreground text-base">
              Skip the drag-and-drop builders. Get a top-tier developer
              portfolio online in three steps.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <FadeIn direction="up" delay={0.1} duration={0.6} className="h-full">
            <Card className="bg-card border-border/30 hover:border-border transition-all duration-300 relative group h-full">
              <CardHeader className="p-6">
                <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-bold mb-4">
                  1
                </div>
                <CardTitle className="text-lg text-foreground font-semibold">
                  Drop Your CV / Résumé
                </CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  Upload your professional PDF CV / Résumé, or walk through our
                  4-question wizard to structure your credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="bg-background/30 border border-border/30 rounded-lg p-3.5 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground/80 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="h-2 w-20 bg-muted rounded mb-1.5" />
                    <div className="h-1.5 w-32 bg-secondary rounded" />
                  </div>
                  <div className="h-5 w-5 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Card 2 */}
          <FadeIn direction="up" delay={0.2} duration={0.6} className="h-full">
            <Card className="bg-card border-border/30 hover:border-border transition-all duration-300 relative group h-full">
              <CardHeader className="p-6">
                <div className="h-10 w-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink font-bold mb-4">
                  2
                </div>
                <CardTitle className="text-lg text-foreground font-semibold">
                  Personalize the Vibe
                </CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  Type instructions to tweak colors, typography, or content
                  sections using simple AI prompting.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="bg-background/30 border border-border/30 rounded-lg p-3.5 flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
                    <span className="text-[10px] text-muted-foreground/80 font-mono">
                      Prompting Layouts...
                    </span>
                  </div>
                  <div className="h-2 bg-linear-to-r from-brand-purple to-brand-pink rounded w-full" />
                  <div className="h-2 bg-secondary rounded w-4/5" />
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Card 3 */}
          <FadeIn direction="up" delay={0.3} duration={0.6} className="h-full">
            <Card className="bg-card border-border/30 hover:border-border transition-all duration-300 relative group h-full">
              <CardHeader className="p-6">
                <div className="h-10 w-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-bold mb-4">
                  3
                </div>
                <CardTitle className="text-lg text-foreground font-semibold">
                  One-Click Deploy
                </CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  Deploy instantly to our globally-distributed edge network, or
                  download a portable HTML file you own forever.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="bg-background/30 border border-border/30 rounded-lg p-3.5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    portable_site.html
                  </span>
                  <Badge className="bg-success/10 text-success border-success/20 text-[9px] gap-1">
                    <Download className="h-2.5 w-2.5" /> Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Feature Section */}
      <section
        id="features"
        className="py-20 md:py-28 bg-background border-t border-b border-border/30 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn direction="up" duration={0.6}>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                Everything you need for an elite web presence
              </h2>
              <p className="text-muted-foreground text-base">
                Engineered for absolute speed, portability, and beautiful
                designs.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <FadeIn
              direction="up"
              delay={0.1}
              duration={0.6}
              className="h-full"
            >
              <Card className="bg-card border-border/30 hover:border-border transition-all duration-300 relative group overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-brand-purple to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-5">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-foreground font-semibold mb-2">
                    AI Personalization
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80 text-sm leading-relaxed">
                    Our advanced engine doesn&apos;t just fill templates. It
                    builds layouts custom-fit for your specific tech stack, role
                    seniority, and industry standards.
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn
              direction="up"
              delay={0.2}
              duration={0.6}
              className="h-full"
            >
              <Card className="bg-card border-border/30 hover:border-border transition-all duration-300 relative group overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-brand-pink to-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center text-brand-pink mb-5">
                    <Download className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-foreground font-semibold mb-2">
                    Absolute Portability
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80 text-sm leading-relaxed">
                    Download a single, standalone HTML file that contains
                    compiled Tailwind CSS, scripts, and embedded assets. Zero
                    server costs. Keep it forever.
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn
              direction="up"
              delay={0.3}
              duration={0.6}
              className="h-full"
            >
              <Card className="bg-card border-border/30 hover:border-border transition-all duration-300 relative group overflow-hidden h-full">
                <div className="absolute top-0 left-0 w-full h-0.75 bg-linear-to-r from-brand-gold to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-5">
                    <Layers className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-foreground font-semibold mb-2">
                    Virtual Multi-Page Routing
                  </CardTitle>
                  <CardDescription className="text-muted-foreground/80 text-sm leading-relaxed">
                    Showcase multiple projects, full resume tabs, and blogs. A
                    custom built client-side router keeps everything responsive
                    inside one single file.
                  </CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-28 relative z-10 max-w-7xl mx-auto px-6 overflow-hidden">
        <FadeIn direction="up" scale={0.95} duration={0.8}>
          <div className="relative rounded-3xl border border-border bg-card/40 p-8 md:p-12 overflow-hidden shadow-2xl">
            {/* Glowing orb behind CTA */}
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-purple/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-80 h-80 bg-brand-pink/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
                Ready to claim your corner of the web?
              </h2>
              <p className="text-muted-foreground text-base mb-8">
                Turn your resume into a performance portfolio in 60 seconds. No
                card required. Completely free to build and test.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm">
                <Link
                  href="#how-it-works"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "border-border text-foreground hover:bg-muted rounded-xl",
                  )}
                >
                  How it works
                </Link>
                <Link
                  href="/app"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "default" }),
                    "bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-lg shadow-foreground/5 transition-all rounded-xl",
                  )}
                >
                  Try Folio for Free
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Section Break */}
      <div className="max-w-7xl mx-auto px-6">
        <Separator className="bg-border/30" />
      </div>

      {/* Footer / Built by Folio Promise */}
      <footer className="relative z-10 py-12 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <SiteLogo />

          <p className="text-muted-foreground/60 text-xs">
            &copy; {new Date().getFullYear()} Folio. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Navigation Pill */}
      <NavigationPill />
    </div>
  );
}
