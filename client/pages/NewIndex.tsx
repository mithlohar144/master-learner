import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Award, Brain, CalendarDays, CheckCircle2, Code2, 
  Flame, GraduationCap, Layout, LineChart, PlayCircle, Shield, 
  Sparkles, Target, Users, Zap, Star, Clock, TrendingUp, BookOpen,
  Quote, ChevronRight, BarChart3, Trophy
} from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function NewIndex({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <main className="min-h-screen">
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA onGetStarted={onGetStarted} />
    </main>
  );
}

function Hero({ onGetStarted }: HeroProps) {
  const features = [
    { icon: CalendarDays, text: "Personalized timetable" },
    { icon: Brain, text: "Adaptive AI questions" },
    { icon: LineChart, text: "Trending tech tracker" },
    { icon: BookOpen, text: "Doubt resolver with videos & docs" },
    { icon: Layout, text: "Solution flowcharts" },
    { icon: GraduationCap, text: "Study Made Easy" },
    { icon: Award, text: "Gamified progress" },
  ];

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex max-w-fit items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" /> 
              AI-Powered Learning Platform
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Master Coding with
                <span className="text-primary block">SmartCode Mentor</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Your AI-powered coding companion that adapts to your learning style. 
                Get personalized schedules, adaptive questions, and instant doubt resolution.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm backdrop-blur">
                  <Icon className="h-4 w-4 text-primary" /> 
                  {text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={onGetStarted} size="lg" className="gap-2 text-lg px-8">
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-lg px-8">
                Watch Demo
                <PlayCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-background" />
                  ))}
                </div>
                <span>10,000+ students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9/5</span>
                <span>rating</span>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="relative">
            <PreviewDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewDashboard() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-3xl" />
      <div className="relative bg-background/95 backdrop-blur border rounded-2xl shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Good morning, Alex! 👋</h3>
            <p className="text-sm text-muted-foreground">Ready to continue your journey?</p>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">7 day streak</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Weekly Goal</span>
            </div>
            <div className="text-lg font-semibold">8/10 hours</div>
          </div>
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Rank</span>
            </div>
            <div className="text-lg font-semibold">Top 15%</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-green-500" />
                <span className="text-sm">Daily Challenge</span>
              </div>
            </button>
            <button className="p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Continue Learning</span>
              </div>
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="p-3 rounded-lg border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">React Fundamentals</span>
            <span className="text-xs text-muted-foreground">75%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: CalendarDays,
      title: "Personalized Learning Path",
      description: "AI creates a custom timetable based on your goals, experience level, and available time.",
      benefits: ["Smart scheduling", "Goal-based planning", "Flexible timing"]
    },
    {
      icon: Brain,
      title: "Adaptive AI Questions",
      description: "Questions that adapt to your performance, ensuring optimal challenge and growth.",
      benefits: ["Dynamic difficulty", "Performance tracking", "Skill assessment"]
    },
    {
      icon: TrendingUp,
      title: "Tech Trend Tracker",
      description: "Stay updated with the latest technologies and industry demands in real-time.",
      benefits: ["Industry insights", "Skill relevance", "Career guidance"]
    },
    {
      icon: BookOpen,
      title: "Instant Doubt Resolution",
      description: "Get explanations, video tutorials, and documentation links for any coding doubt.",
      benefits: ["AI explanations", "Video resources", "Documentation links"]
    },
    {
      icon: Layout,
      title: "Visual Learning Tools",
      description: "Interactive flowcharts and diagrams to understand complex algorithms visually.",
      benefits: ["Visual algorithms", "Step-by-step flows", "Interactive diagrams"]
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Earn XP, badges, and maintain streaks to stay motivated throughout your journey.",
      benefits: ["XP system", "Achievement badges", "Streak tracking"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to master coding
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform provides comprehensive tools and resources 
            to accelerate your coding journey from beginner to expert.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Set Your Goals",
      description: "Tell us about your coding experience, goals, and time availability.",
      icon: Target
    },
    {
      step: 2,
      title: "Get Your Plan",
      description: "Receive a personalized learning roadmap with daily schedules and milestones.",
      icon: CalendarDays
    },
    {
      step: 3,
      title: "Learn & Practice",
      description: "Follow adaptive lessons, solve questions, and get instant feedback.",
      icon: Brain
    },
    {
      step: 4,
      title: "Track Progress",
      description: "Monitor your growth with detailed analytics and achievement badges.",
      icon: BarChart3
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How SmartCode Mentor Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and begin your personalized coding journey today.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="text-center">
              <div className="relative mb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-y-0.5" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer at Google",
      content: "SmartCode Mentor helped me transition from design to development. The personalized learning path was exactly what I needed.",
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "CS Student at MIT",
      content: "The adaptive questions feature is incredible. It always challenges me at the right level and helps me improve consistently.",
      avatar: "MJ"
    },
    {
      name: "Priya Patel",
      role: "Full Stack Developer",
      content: "I love how it tracks trending technologies. It keeps me updated with industry demands and helps me stay relevant.",
      avatar: "PP"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by thousands of developers
          </h2>
          <p className="text-xl text-muted-foreground">
            Join the community of successful developers who transformed their careers with SmartCode Mentor.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ onGetStarted }: HeroProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to accelerate your coding journey?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of developers who are already learning smarter, not harder.
            Start your personalized coding journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              variant="secondary" 
              className="gap-2 text-lg px-8"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 text-lg px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Schedule Demo
              <CalendarDays className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Start in 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
