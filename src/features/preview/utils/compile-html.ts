export function compilePortfolioHTML(
  name: string,
  headline: string,
  achievementsText: string,
  skillsText: string,
  vibeText: string,
) {
  const finalName = name.trim() || "John Doe";
  const finalHeadline =
    headline.trim() ||
    "Lead Software Engineer specializing in developer experience.";

  // Parse achievements
  const achievements = achievementsText
    .split("\n")
    .map((a) => a.trim())
    .filter((a) => a.length > 0);
  const finalAchievements =
    achievements.length > 0
      ? achievements
      : [
          "Engineered the core deploy engine for Vercel scale command tools.",
          "Optimized React client bundle payloads, lowering bundle weights by 45%.",
          "Deployed highly reliable cloud orchestrations serving 3M+ active sessions.",
        ];

  // Parse skills
  const skills = skillsText
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const finalSkills =
    skills.length > 0
      ? skills
      : [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Node.js",
          "GraphQL",
        ];

  const vibePrompt = vibeText.toLowerCase();

  // Setup visual themes
  let bgGradient = "from-zinc-950 via-zinc-900 to-zinc-950";
  let textColor = "text-zinc-100";
  let mutedTextColor = "text-zinc-400";
  let borderStyle = "border-zinc-800/80";
  let accentColor = "from-brand-purple via-brand-pink to-brand-gold";
  let badgeStyle = "bg-brand-purple/10 text-brand-pink border-brand-pink/20";
  let buttonStyle =
    "bg-linear-to-r from-brand-purple to-brand-pink text-white shadow-lg shadow-brand-purple/20";

  if (
    vibePrompt.includes("neon") ||
    vibePrompt.includes("cyberpunk") ||
    vibePrompt.includes("dark")
  ) {
    bgGradient = "from-black via-zinc-950 to-black";
    textColor = "text-zinc-50";
    mutedTextColor = "text-emerald-500/70";
    borderStyle = "border-emerald-500/25";
    accentColor = "from-emerald-400 via-teal-500 to-cyan-500";
    badgeStyle =
      "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 font-mono";
    buttonStyle =
      "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold font-mono border-emerald-500/50 shadow-emerald-500/20 shadow-md";
  } else if (
    vibePrompt.includes("minimal") ||
    vibePrompt.includes("slate") ||
    vibePrompt.includes("clean")
  ) {
    bgGradient = "from-slate-950 via-slate-900 to-slate-950";
    textColor = "text-slate-100";
    mutedTextColor = "text-slate-400";
    borderStyle = "border-slate-800";
    accentColor = "from-slate-200 to-slate-300";
    badgeStyle = "bg-slate-800/50 text-slate-300 border-slate-700/50";
    buttonStyle = "bg-slate-100 text-slate-950 font-medium hover:bg-slate-200";
  }

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${finalName} - Professional Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    body {
      font-family: 'Inter', sans-serif;
    }
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
  </style>
</head>
<body class="bg-linear-to-b ${bgGradient} ${textColor} min-h-screen flex flex-col justify-between selection:bg-white/10 scrollbar-none overflow-y-auto">
  <!-- Dynamic Glowing Background Asset -->
  <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none opacity-25 blur-[120px] z-0 bg-linear-to-r ${accentColor}"></div>

  <div class="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 flex-1">
    <!-- Header -->
    <header class="flex justify-between items-center mb-16">
      <span class="font-extrabold tracking-tight text-lg">${finalName
        .split(" ")
        .map((n) => n[0])
        .join("")}.</span>
      <nav class="flex gap-4 text-xs font-medium opacity-80">
        <a href="#about" class="hover:opacity-100 transition-opacity">About</a>
        <a href="#experience" class="hover:opacity-100 transition-opacity">Projects</a>
        <a href="#contact" class="hover:opacity-100 transition-opacity">Contact</a>
      </nav>
    </header>

    <main class="space-y-12">
      <!-- Bio Header -->
      <section id="about" class="space-y-4">
        <span class="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${badgeStyle}">
          ● Available for Hire
        </span>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl leading-none">
          I'm <span class="bg-clip-text text-transparent bg-linear-to-r ${accentColor}">${finalName}</span>
        </h1>
        <p class="text-sm sm:text-base leading-relaxed ${mutedTextColor}">
          ${finalHeadline}
        </p>
      </section>

      <!-- Key Achievements -->
      <section id="experience" class="space-y-4 pt-2">
        <h2 class="text-xs uppercase font-extrabold tracking-wider opacity-60">Featured Achievements</h2>
        <div class="space-y-4.5">
          ${finalAchievements
            .map(
              (item, idx) => `
            <div class="p-4.5 rounded-xl border ${borderStyle} bg-white/5 backdrop-blur-md flex gap-3.5">
              <span class="h-6 w-6 rounded-lg bg-white/5 border ${borderStyle} flex items-center justify-center text-xs font-bold shrink-0">${idx + 1}</span>
              <p class="text-xs sm:text-sm leading-relaxed">${item}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>

      <!-- Skills -->
      <section class="space-y-4 pt-2">
        <h2 class="text-xs uppercase font-extrabold tracking-wider opacity-60">Technical Expertise</h2>
        <div class="flex flex-wrap gap-2.5">
          ${finalSkills
            .map(
              (skill) => `
            <span class="text-xs px-3 py-1 rounded-xl border ${borderStyle} bg-white/5 font-semibold transition-all hover:bg-white/10">${skill}</span>
          `,
            )
            .join("")}
        </div>
      </section>

      <!-- Contact Banner -->
      <section id="contact" class="space-y-6 pt-6 text-center border-t ${borderStyle}">
        <div class="space-y-2">
          <h2 class="text-lg font-bold">Start a project with me</h2>
          <p class="text-xs ${mutedTextColor}">Have a job proposal, a layout idea, or need consultation? Drop a line.</p>
        </div>
        <button class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 ${buttonStyle}" onclick="alert('Inquiry sent! Thanks for connecting.')">
          Get in Touch
        </button>
      </section>
    </main>
  </div>

  <footer class="relative z-10 py-8 border-t ${borderStyle} text-center text-[10px] opacity-50">
    <p>&copy; ${new Date().getFullYear()} ${finalName}. Powered by <span class="font-bold">Folio</span>.</p>
  </footer>
</body>
</html>`;
}
