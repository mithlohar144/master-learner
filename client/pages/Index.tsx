import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, Award, Brain, CalendarDays, CheckCircle2, Code2, 
  Flame, GraduationCap, Layout, LineChart, PlayCircle, Shield, 
  Sparkles, Target, Users, Zap, Star, Clock, TrendingUp, BookOpen
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      <Hero onGetStarted={() => navigate('/onboarding')} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA onGetStarted={() => navigate('/onboarding')} />
    </main>
  );
}

function Hero() {
  const features = [
    { icon: CalendarDays, text: "Personalized timetable" },
    { icon: Brain, text: "Adaptive AI questions" },
    { icon: LineChart, text: "Trending tech tracker" },
    { icon: Youtube, text: "Doubt resolver with videos & docs" },
    { icon: Layout, text: "Solution flowcharts" },
    { icon: GraduationCap, text: "Study Made Easy" },
    { icon: Award, text: "Gamified progress" },
  ];

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
      <div className="container mx-auto grid gap-8 py-16 md:grid-cols-2 md:py-20">
        <div className="flex flex-col justify-center gap-6">
          <div className="inline-flex max-w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-primary" /> Docs-ready Blueprint
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            SmartCode Mentor
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered coding mentor for students: personalized timetable, adaptive questions, trending tech, doubt resolution, flowcharts, interactive study, and gamified progress — all in one dashboard.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                <Icon className="h-3.5 w-3.5 text-primary" /> {text}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="gap-2">
              <a href="#timetable">
                Start your plan <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" className="gap-2">
              <a href="#trending">
                View trends <GitBranch className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="grid content-center gap-4">
          <PreviewPanel />
        </div>
      </div>
    </section>
  );
}

function PreviewPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="text-base">Today’s Focus</CardTitle>
          <CardDescription>Data Structures, DP (90 mins)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-2 w-full rounded bg-muted">
            <div className="h-2 rounded bg-primary" style={{ width: "64%" }} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Flame className="h-4 w-4 text-orange-500" /> 5-day streak
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trending Now</CardTitle>
          <CardDescription>Python • React • TensorFlow</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {["Python", "React", "TensorFlow"].map((t) => (
            <Badge key={t} variant="secondary" className="px-2 py-1">
              {t}
            </Badge>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Question</CardTitle>
          <CardDescription>
            Time complexity of binary search?
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          O(log n)
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Doubt Links</CardTitle>
          <CardDescription>Youtube + Docs</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <a className="flex items-center gap-2 text-primary" href="https://www.youtube.com/results?search_query=binary+search+explained" target="_blank" rel="noreferrer">
            <PlayCircle className="h-4 w-4" /> Binary Search videos
          </a>
          <a className="mt-2 flex items-center gap-2 text-primary" href="https://react.dev/learn" target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" /> React Docs
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardGrid() {
  return (
    <div className="grid gap-6" id="dashboard">
      <Timetable />
      <AdaptiveQuestions />
      <TrendingTech />
      <DoubtResolver />
      <FlowchartViewer />
      <StudyMadeEasy />
      <ProgressGamification />
    </div>
  );
}

// A. Personalized Daily Timetable (Week view)
function Timetable() {
  const [goal, setGoal] = useState("Master DSA & React");
  const [hours, setHours] = useState(2);

  const week = useMemo(() => buildWeekSample(), []);
  const [selected, setSelected] = useState(2); // highlight Wednesday by default

  return (
    <section id="timetable" className="scroll-mt-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Learning Timetable</h2>
          <p className="text-sm text-muted-foreground">Your personalized learning schedule — AI-generated based on your goals and progress</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-sm text-muted-foreground">This Week</div>
            <Button size="sm" variant="ghost">Add Task</Button>
          </div>
          <div className="text-sm inline-flex items-center gap-3 rounded-full bg-background/60 px-3 py-1">
            <div className="text-xs text-muted-foreground">{hours}h/day</div>
            <Button size="sm" onClick={() => setHours((h) => Math.min(12, h + 1))}>+1h</Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-[1000px]">
          {week.map((day, idx) => (
            <div key={day.name} className={cn(
              "flex-shrink-0 w-44 rounded-xl border p-4 bg-card text-card-foreground shadow-lg",
              idx === selected ? "ring-2 ring-primary border-primary" : "border-transparent"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{day.name}</div>
                  <div className="text-sm font-medium">{day.date}</div>
                </div>
                <div className="text-xs text-muted-foreground">{day.completed}/{day.total}</div>
              </div>

              <div className="mt-4 space-y-3">
                {day.tasks.map((t, i) => (
                  <div key={i} className="rounded-lg border bg-gradient-to-b from-card/80 to-card p-3 shadow-md hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground">{t.time}</div>
                        <div className="mt-1 font-medium text-sm">{t.title}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs capitalize">{t.tag}</span>
                        <span className="text-xs text-muted-foreground">{t.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-2 text-center">
                  <button className="text-xs text-primary hover:underline">+ Add slot</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildWeekSample() {
  const days = [
    { name: "Mon", date: "", completed: 2, total: 2, tasks: [
      { time: "09:00", title: "JavaScript Fundamentals", duration: 60, tag: "study" },
      { time: "10:30", title: "Array Methods Practice", duration: 30, tag: "questions" },
    ]},
    { name: "Tue", date: "", completed: 2, total: 3, tasks: [
      { time: "09:00", title: "React Components", duration: 45, tag: "study" },
      { time: "11:00", title: "Component Quiz", duration: 20, tag: "questions" },
      { time: "14:00", title: "Explore Vite", duration: 30, tag: "trending" },
    ]},
    { name: "Wed", date: "", completed: 0, total: 3, tasks: [
      { time: "09:00", title: "React Hooks Deep Dive", duration: 60, tag: "study" },
      { time: "10:30", title: "Hook Challenge", duration: 30, tag: "questions" },
      { time: "14:00", title: "Next.js 14 Features", duration: 30, tag: "trending" },
    ]},
    { name: "Thu", date: "", completed: 0, total: 2, tasks: [
      { time: "09:00", title: "State Management", duration: 45, tag: "study" },
      { time: "11:00", title: "Redux Basics", duration: 40, tag: "study" },
    ]},
    { name: "Fri", date: "", completed: 0, total: 2, tasks: [
      { time: "09:00", title: "API Integration", duration: 60, tag: "study" },
      { time: "10:30", title: "Fetch API Practice", duration: 25, tag: "questions" },
    ]},
    { name: "Sat", date: "", completed: 0, total: 1, tasks: [
      { time: "10:00", title: "Project Building", duration: 90, tag: "project" },
    ]},
    { name: "Sun", date: "", completed: 0, total: 1, tasks: [
      { time: "11:00", title: "Week Review & Planning", duration: 30, tag: "review" },
    ]},
  ];
  // add simple date numbers
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1); // Monday
  return days.map((d, i) => ({ ...d, date: `${start.getDate() + i}` }));
}

function buildPlan(goal: string, hours: number) {
  const total = Math.max(1, Math.min(10, hours));
  const blocks = [
    {
      label: "Warmup: Revision Quiz",
      part: 0.15,
      resources: [
        { title: "DSA 50 Qns", href: "https://leetcode.com/study-plan/" },
      ],
    },
    {
      label: "Core Topic Practice",
      part: 0.45,
      resources: [
        { title: "NeetCode", href: "https://neetcode.io/" },
        { title: "CP Handbook", href: "https://cses.fi/book/" },
      ],
    },
    {
      label: "Concept Video + Notes",
      part: 0.25,
      resources: [
        { title: "MIT OpenCourseWare", href: "https://ocw.mit.edu/" },
      ],
    },
    {
      label: "Project/Build (React)",
      part: 0.15,
      resources: [
        { title: "React Docs", href: "https://react.dev/learn" },
      ],
    },
  ];
  const minutesTotal = Math.round(total * 60);
  return blocks.map((b) => ({
    label: `${b.label}`,
    minutes: Math.max(10, Math.round(b.part * minutesTotal)),
    resources: b.resources,
  }));
}

// B. Adaptive AI Question Generator (multiple-choice)
function AdaptiveQuestions() {
  const topicBank: Record<string, { q: string; a: string; options: string[]; d: number }[]> = {
    DSA: [
      { q: "What is the time complexity of binary search?", a: "O(log n)", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], d: 1 },
      { q: "Explain two-pointer technique.", a: "Use two indices to converge/expand based on condition.", options: ["Use recursion to split", "Use two indices to converge/expand", "Use hashing for lookups", "Use sorting then binary search"], d: 1 },
      { q: "Implement LRU cache core idea.", a: "HashMap + Doubly linked list for O(1) ops.", options: ["Binary heap + set", "HashMap + Doubly linked list", "Stack + queue", "Balanced BST"], d: 2 },
      { q: "Why is quicksort average O(n log n)?", a: "Divide-and-conquer with balanced partitions on average.", options: ["Because it always picks median", "Because of divide-and-conquer with balanced partitions", "Because it uses hashing", "Because it is stable"], d: 2 },
      { q: "What is a segment tree used for?", a: "Range queries/updates in O(log n).", options: ["Sorting arrays", "Range queries/updates in O(log n)", "Managing memory allocation", "Building GUIs"], d: 3 },
    ],
    React: [
      { q: "What are hooks?", a: "Functions like useState/useEffect to manage state & effects.", options: ["Styling helpers", "Routing utilities", "Functions like useState/useEffect", "Build tools"], d: 1 },
      { q: "Explain reconciliation.", a: "Diffing virtual tree to update DOM efficiently.", options: ["Server-side rendering", "Diffing virtual tree to update DOM", "Compiling JSX", "Minifying code"], d: 2 },
      { q: "Why use keys in lists?", a: "To help React identify items across renders.", options: ["For styling", "For SEO", "To help React identify items", "To sort items"], d: 1 },
    ],
  };

  const topics = Object.keys(topicBank);
  const [topic, setTopic] = useState(topics[0]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const deck = topicBank[topic];
  const card = deck[idx % deck.length];

  function nextQuestion(moveNext = true) {
    setSelected(null);
    setLocked(false);
    if (!moveNext) return;
    setIdx((i) => (i + 1) % deck.length);
  }

  function handleSelect(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    const correct = card.options[i] === card.a;
    if (correct) setScore((s) => s + 1);
    // adjust difficulty and pick next after short delay
    setTimeout(() => {
      // find next index based on difficulty
      const harder = correct ? Math.min(3, card.d + 1) : Math.max(1, card.d - 1);
      const nextIdx = deck.findIndex((c, j) => j !== idx && c.d === harder);
      setIdx(nextIdx >= 0 ? nextIdx : (idx + 1) % deck.length);
      setSelected(null);
      setLocked(false);
    }, 700);
  }

  return (
    <section id="questions" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <div>Adaptive AI Question Generator</div>
                  <div className="text-xs text-muted-foreground">Difficulty adapts to your performance</div>
                </div>
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Difficulty: <span className="ml-2 text-sm text-foreground">{"★".repeat(card.d)}</span></div>
              <div className="flex gap-2">
                {topics.map((t) => (
                  <Button key={t} variant={t === topic ? "default" : "ghost"} size="sm" onClick={() => { setTopic(t); setIdx(0); }}>
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border bg-gradient-to-b from-card/80 to-card p-6 shadow-md">
                <div className="text-sm text-muted-foreground">Question</div>
                <div className="mt-2 text-xl font-semibold">{card.q}</div>

                <div className="mt-4 grid gap-3">
                  {card.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const correct = opt === card.a;
                    const base = "w-full text-left rounded-md px-4 py-2 border";
                    const cls = locked
                      ? isSelected
                        ? correct
                          ? "border-green-600 bg-green-600/5"
                          : "border-destructive bg-destructive/5"
                        : "opacity-50"
                      : "hover:bg-background/30";
                    return (
                      <button key={i} onClick={() => handleSelect(i)} disabled={locked} className={cn(base, cls)}>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <details className="mt-4 rounded-md bg-background/20 p-4">
                  <summary className="cursor-pointer text-primary font-medium">Reveal answer & explanation</summary>
                  <div className="mt-2 text-sm text-muted-foreground">{card.a}</div>
                </details>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Button variant="ghost" onClick={() => nextQuestion(false)}>Next</Button>
                <Button variant="outline" onClick={() => { setIdx((i) => (i + 1) % deck.length); }}>Skip</Button>
              </div>
            </div>

            <aside className="md:col-span-1">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="text-sm font-medium">Progress</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={Math.min(100, (score / 10) * 100)} />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div>Score</div>
                      <div>{score}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm font-medium">Stats</div>
                <div className="mt-2 grid gap-2 text-xs text-muted-foreground">
                  <div>Correct answers: {score}</div>
                  <div>Streak: {Math.min(score, 7)} days</div>
                  <div>Suggested next: {topic}</div>
                </div>
              </div>
            </aside>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// C. Trending Tech Stack Tracker
function TrendingTech() {
  const sources = [
    { name: "GitHub", href: "https://github.com/trending" },
    { name: "StackOverflow", href: "https://stackoverflow.com/questions" },
    { name: "HackerNews", href: "https://news.ycombinator.com/" },
  ];
  const trending = [
    { tag: "Python", score: 96 },
    { tag: "React", score: 92 },
    { tag: "TensorFlow", score: 88 },
    { tag: "Rust", score: 84 },
    { tag: "Next.js", score: 83 },
  ];
  return (
    <section id="trending" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <LineChart className="h-5 w-5 text-primary" /> Trending Tech Stack
          </CardTitle>
          <CardDescription>Aggregated from GitHub • StackOverflow • HackerNews</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Currently Trending</div>
            <div className="flex flex-wrap gap-2">
              {trending.slice(0, 3).map((t) => (
                <Badge key={t.tag} className="px-2 py-1">{t.tag}</Badge>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Scores estimate combined velocity across sources.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {sources.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary">
                  <ExternalLink className="h-3.5 w-3.5" /> {s.name}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 grid gap-3">
            {trending.map((t) => (
              <div key={t.tag} className="grid grid-cols-[120px_1fr_40px] items-center gap-3">
                <div className="text-sm">{t.tag}</div>
                <Progress value={t.score} />
                <div className="text-xs text-muted-foreground">{t.score}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

// D. Doubt Resolver
function DoubtResolver() {
  const [input, setInput] = useState("");
  const [explanation, setExplanation] = useState<string[]>([]);
  const [links, setLinks] = useState<{ title: string; href: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchExplanation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || res.statusText || "Request failed");
      }
      const data = (await res.json()) as { explanation: string[]; links: { title: string; href: string }[] };
      setExplanation(data.explanation || []);
      setLinks(data.links || []);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="doubts" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <HelpHeader /> Doubt Resolver
          </CardTitle>
          <CardDescription>Paste a doubt or code snippet → get step-by-step help + links</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your doubt or paste code..."
            />
            <div className="flex items-center gap-2">
              <Button onClick={fetchExplanation} disabled={loading || !input.trim()}>
                {loading ? "Thinking..." : "Get Explanation"}
              </Button>
              <Button variant="ghost" onClick={() => { setInput(""); setExplanation([]); setLinks([]); setError(null); }}>
                Clear
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">Answers are generated by the server mock. Connect OpenAI for real AI responses.</div>
            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium">Suggested Explanation</div>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              {explanation.length === 0 ? (
                <li>No explanation yet. Enter a doubt and click "Get Explanation".</li>
              ) : (
                explanation.map((s, i) => <li key={i}>{s}</li>)
              )}
            </ol>
            <div className="pt-2 text-sm font-medium">Helpful Links</div>
            <div className="flex flex-wrap gap-3">
              {links.map((l) => (
                <a key={l.href} className="inline-flex items-center gap-1 text-primary" href={l.href} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" /> {l.title}
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function HelpHeader() {
  return <span className="inline-flex items-center gap-2"><Code2 className="h-5 w-5 text-primary" /> <span>AI + YouTube + Docs</span></span>;
}

function explain(s: string) {
  if (!s.trim()) return ["Break the problem, identify inputs/outputs, outline steps, then test with examples."];
  const key = s.toLowerCase();
  const steps: string[] = [];
  if (key.includes("binary") && key.includes("search")) {
    steps.push("Sort array (if not sorted) then use low/high pointers.");
    steps.push("Check mid; move low/high based on comparison.");
    steps.push("Stop when found or low > high.");
  }
  if (key.includes("react")) {
    steps.push("Identify state and effects; isolate into components.");
    steps.push("Use hooks (useState/useEffect) and props drilling or context.");
  }
  if (steps.length === 0) steps.push("Reproduce issue with minimal example, then iterate.");
  steps.push("Validate edge cases and measure complexity.");
  return steps;
}

function buildLinks(s: string) {
  const q = encodeURIComponent(s || "coding doubt");
  const base = [
    { title: "YouTube Search", href: `https://www.youtube.com/results?search_query=${q}` },
    { title: "StackOverflow", href: `https://stackoverflow.com/search?q=${q}` },
  ];
  const docs: { title: string; href: string }[] = [];
  const key = s.toLowerCase();
  if (key.includes("react")) docs.push({ title: "React Docs", href: "https://react.dev/learn" });
  if (key.includes("python")) docs.push({ title: "Python Docs", href: "https://docs.python.org/3/" });
  if (key.includes("tensorflow")) docs.push({ title: "TensorFlow Docs", href: "https://www.tensorflow.org/learn" });
  return [...base, ...docs];
}

// E. Problem Solution Flowchart Generator (lightweight interactive)
function FlowchartViewer() {
  const [problem, setProblem] = useState("Two Sum");
  const flow = useMemo(() => buildFlow(problem), [problem]);
  return (
    <section id="flowchart" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Layout className="h-5 w-5 text-primary" /> Problem Solution Flowchart
          </CardTitle>
          <CardDescription>Hover nodes for explanations. Export coming later.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={problem} onValueChange={setProblem} className="w-full">
            <TabsList className="flex flex-wrap">
              {["Two Sum", "Binary Search", "Palindrome"].map((p) => (
                <TabsTrigger key={p} value={p}>{p}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={problem} className="mt-6">
              <div className="relative overflow-x-auto rounded-lg border bg-background p-6">
                <Diagram nodes={flow.nodes} edges={flow.edges} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}

type Node = { id: string; label: string; x: number; y: number; hint?: string };
function Diagram({ nodes, edges }: { nodes: Node[]; edges: [string, string][] }) {
  return (
    <div className="relative h-[300px] min-w-[600px]">
      {edges.map(([a, b], i) => {
        const A = nodes.find((n) => n.id === a)!;
        const B = nodes.find((n) => n.id === b)!;
        const x1 = A.x + 80;
        const y1 = A.y + 24;
        const x2 = B.x;
        const y2 = B.y + 24;
        return (
          <svg key={i} className="absolute left-0 top-0 h-full w-full" viewBox="0 0 900 300" preserveAspectRatio="none">
            <defs>
              <marker id={`arrow-${i}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
              </marker>
            </defs>
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-muted-foreground/50" strokeWidth="2" markerEnd={`url(#arrow-${i})`} />
          </svg>
        );
      })}
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute w-40 cursor-default rounded-lg border bg-card p-3 text-sm shadow-sm transition-transform hover:scale-[1.02]"
          style={{ left: n.x, top: n.y }}
          title={n.hint}
        >
          <div className="font-medium">{n.label}</div>
          {n.hint && <div className="mt-1 text-xs text-muted-foreground">{n.hint}</div>}
        </div>
      ))}
    </div>
  );
}

function buildFlow(name: string) {
  const common: Node[] = [
    { id: "start", label: "Start", x: 20, y: 110 },
    { id: "input", label: "Read input", x: 160, y: 110, hint: "nums, target" },
    { id: "logic", label: "Process", x: 320, y: 110 },
    { id: "output", label: "Return result", x: 520, y: 110 },
    { id: "end", label: "End", x: 720, y: 110 },
  ];
  if (name === "Two Sum") {
    common[2].hint = "HashMap to store seen values";
  } else if (name === "Binary Search") {
    common[2].hint = "Update low/high until found";
  } else {
    common[2].hint = "Two pointers from ends";
  }
  const edges: [string, string][] = [
    ["start", "input"],
    ["input", "logic"],
    ["logic", "output"],
    ["output", "end"],
  ];
  return { nodes: common, edges };
}

// F. Study Made Easy
function StudyMadeEasy() {
  const [tab, setTab] = useState("Arrays");
  const topics = {
    Arrays: {
      subs: ["Basics", "Two Pointers", "Prefix Sum"],
      example: `function maxSubarray(nums){\n  let best = -Infinity, cur = 0;\n  for (const n of nums){\n    cur = Math.max(n, cur + n);\n    best = Math.max(best, cur);\n  }\n  return best;\n}`,
      quiz: {
        q: "Kadane's algorithm solves?",
        options: ["Longest increasing", "Maximum subarray sum", "Array rotation"],
        answer: 1,
      },
    },
    React: {
      subs: ["JSX", "Hooks", "State Mgmt"],
      example: `function Counter(){\n  const [n,setN] = useState(0);\n  return <button onClick={()=>setN(n+1)}>Count {n}</button>;\n}`,
      quiz: {
        q: "useEffect is for?",
        options: ["Styling", "Side effects", "Routing"],
        answer: 1,
      },
    },
  } as const;

  const data = (topics as any)[tab];
  const [choice, setChoice] = useState<number | null>(null);

  return (
    <section id="study" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookIcon /> Study Made Easy
          </CardTitle>
          <CardDescription>Subtopics • Interactive examples • Micro quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="rounded-full bg-muted p-1 px-1.5">
                  {Object.keys(topics).map((t) => (
                    <TabsTrigger key={t} value={t} className="px-4 py-1 rounded-full">{t}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="mb-3 text-sm font-medium">Subtopics</div>
                <div className="grid gap-2">
                  {data.subs.map((s: string) => (
                    <div key={s} className="rounded-md border bg-background/30 px-3 py-2 text-sm text-muted-foreground">{s}</div>
                  ))}
                </div>

                <div className="mt-6 text-sm font-medium">Micro-quiz</div>
                <div className="mt-2 space-y-2">
                  <div className="rounded-md border p-3 bg-card">
                    <div className="font-medium text-sm">{data.quiz.q}</div>
                    <div className="mt-2 grid gap-2">
                      {data.quiz.options.map((o: string, i: number) => (
                        <button
                          key={o}
                          onClick={() => setChoice(i)}
                          className={cn(
                            "w-full rounded-md border px-3 py-2 text-left text-sm",
                            choice === i && (i === data.quiz.answer ? "border-green-600 bg-green-600/5" : "border-destructive bg-destructive/5"),
                          )}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="mb-3 text-sm font-medium">Interactive Example</div>
                <div className="rounded-lg border bg-gradient-to-b from-card/80 to-card p-4 shadow-md">
                  <pre className="max-h-[260px] overflow-auto rounded-md bg-[#0b1220] p-4 text-xs font-mono leading-relaxed text-[#dbeafe]">{data.example}</pre>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Copy and run this in your editor to explore.</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">Run</Button>
                      <Button size="sm">Copy</Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-md border p-3 bg-card">
                    <div className="text-sm font-medium">Tips</div>
                    <ul className="mt-2 text-xs text-muted-foreground list-disc pl-4">
                      <li>Break problems into subproblems</li>
                      <li>Write tests for edge cases</li>
                      <li>Focus on time & space complexity</li>
                    </ul>
                  </div>
                  <div className="rounded-md border p-3 bg-card">
                    <div className="text-sm font-medium">Resources</div>
                    <div className="mt-2 text-xs flex flex-col gap-2">
                      <a className="text-primary" href="https://neetcode.io/" target="_blank" rel="noreferrer">NeetCode</a>
                      <a className="text-primary" href="https://react.dev/learn" target="_blank" rel="noreferrer">React Docs</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function BookIcon() { return <BookOpen className="h-5 w-5 text-primary" />; }

// G. Progress Tracker + Gamification
function ProgressGamification() {
  const stats = {
    topics: 12,
    questions: 140,
    streak: 5,
    xp: 1280,
  };
  const goals = [
    { label: "Arrays", value: 90 },
    { label: "DP", value: 60 },
    { label: "React", value: 75 },
  ];
  const badges = [
    { icon: Flame, text: "3-day comeback" },
    { icon: Sigma, text: "100 Qns" },
    { icon: Award, text: "Topic Master" },
  ];
  return (
    <section id="progress" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Swords className="h-5 w-5 text-primary" /> Progress & Gamification
          </CardTitle>
          <CardDescription>Track topics, questions, streaks, badges, XP</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <div className="text-sm">Overview</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric label="Topics" value={stats.topics} />
              <Metric label="Questions" value={stats.questions} />
              <Metric label="Streak" value={`${stats.streak} days`} />
              <Metric label="XP" value={stats.xp} />
            </div>
            <div className="pt-2 text-xs text-muted-foreground">Adaptive suggestions unlock as you progress.</div>
          </div>
          <div className="md:col-span-2 grid gap-3">
            {goals.map((g) => (
              <div key={g.label} className="grid grid-cols-[120px_1fr_40px] items-center gap-3">
                <div className="text-sm">{g.label}</div>
                <Progress value={g.value} />
                <div className="text-xs text-muted-foreground">{g.value}%</div>
              </div>
            ))}
            <div className="mt-4">
              <div className="text-sm font-medium">Badges</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                    <b.icon className="h-4 w-4 text-primary" /> {b.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
