import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, Award, Brain, CalendarDays, Code2, 
  Flame, PlayCircle, Sparkles, Target, Star, TrendingUp,
  Rocket
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ModernHero onGetStarted={() => navigate('/onboarding')} />
      <InteractiveFeatures />
      <ModernHowItWorks />
      <ProfessionalTestimonials />
      <ModernCTA onGetStarted={() => navigate('/onboarding')} />
    </main>
  );
}

function ModernHero({ onGetStarted }: { onGetStarted: () => void }) {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    { 
      icon: Brain, 
      title: "AI-Powered Learning", 
      description: "Adaptive questions that evolve with your progress",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: CalendarDays, 
      title: "Smart Scheduling", 
      description: "Personalized timetables based on your goals",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: TrendingUp, 
      title: "Industry Trends", 
      description: "Stay updated with latest tech developments",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: Target, 
      title: "Goal Tracking", 
      description: "Monitor progress with detailed analytics",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4); // Fixed number instead of features.length
    }, 4000); // Slower interval to reduce repaints
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-20"></div>
      
      <div className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>AI-Powered Learning Platform</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Smart
                </span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Code
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mentor
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Transform your coding journey with AI-driven personalized learning, 
                adaptive challenges, and real-time progress tracking.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={onGetStarted} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl backdrop-blur-sm"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-500 cursor-pointer",
                    activeFeature === index
                      ? "bg-white/10 border-white/30 scale-105"
                      : "bg-white/5 border-white/10 hover:bg-white/8"
                  )}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-r mb-3 flex items-center justify-center", feature.color)}>
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <InteractiveDashboardPreview activeFeature={activeFeature} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InteractiveDashboardPreview({ activeFeature }: { activeFeature: number }) {
  const [progress, setProgress] = useState(65);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 20 : prev + 5); // Fixed increment instead of random
    }, 3000); // Slower updates
    return () => clearInterval(interval);
  }, []);

  const featureContent = [
    {
      title: "AI Learning Assistant",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Next Challenge</div>
              <div className="text-xs text-gray-300">Binary Tree Traversal</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Smart Schedule",
      content: (
        <div className="space-y-3">
          <div className="text-sm font-medium text-white mb-3">Today's Plan</div>
          {[
            { time: "9:00 AM", task: "React Hooks", duration: "45min" },
            { time: "10:30 AM", task: "Algorithm Practice", duration: "60min" },
            { time: "2:00 PM", task: "System Design", duration: "30min" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/10">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="flex-1">
                <div className="text-xs text-white">{item.task}</div>
                <div className="text-xs text-gray-400">{item.time} • {item.duration}</div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Tech Trends",
      content: (
        <div className="space-y-3">
          <div className="text-sm font-medium text-white mb-3">Trending Now</div>
          {[
            { tech: "Next.js 14", trend: "+15%", color: "bg-green-500" },
            { tech: "TypeScript", trend: "+8%", color: "bg-blue-500" },
            { tech: "Tailwind CSS", trend: "+12%", color: "bg-cyan-500" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/10">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                <span className="text-xs text-white">{item.tech}</span>
              </div>
              <span className="text-xs text-green-400">{item.trend}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Goal Analytics",
      content: (
        <div className="space-y-4">
          <div className="text-sm font-medium text-white">Weekly Goals</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-white/10">
              <div className="text-lg font-bold text-white">7</div>
              <div className="text-xs text-gray-400">Problems Solved</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/10">
              <div className="text-lg font-bold text-white">4.2h</div>
              <div className="text-xs text-gray-400">Study Time</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-xs text-white">5-day streak!</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Dashboard Preview</h3>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/30"></div>
          ))}
        </div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        {featureContent[activeFeature]?.content}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {featureContent.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              activeFeature === index ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function InteractiveFeatures() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Adaptive Learning",
      description: "Smart algorithms that adjust difficulty based on your performance and learning pace.",
      stats: "95% accuracy improvement",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: CalendarDays,
      title: "Personalized Study Schedules",
      description: "Custom timetables generated based on your goals, availability, and learning style.",
      stats: "3x faster progress",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: TrendingUp,
      title: "Real-time Industry Trends",
      description: "Stay ahead with the latest technology trends and in-demand skills.",
      stats: "500+ tech trends tracked",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Target,
      title: "Goal-Oriented Progress",
      description: "Track your journey with detailed analytics and milestone achievements.",
      stats: "90% goal completion rate",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Why Choose SmartCode Mentor?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of coding education with our advanced AI-powered platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={cn(
                "group cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl",
                hoveredFeature === index ? "scale-102 -translate-y-1" : ""
              )}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 rounded-lg", feature.bgColor)} />
              <CardHeader className="relative">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-r mb-4 flex items-center justify-center shadow-lg", feature.color)}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className={cn("text-sm font-semibold bg-gradient-to-r bg-clip-text text-transparent", feature.color)}>
                  {feature.stats}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModernHowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Assessment & Goal Setting",
      description: "Take our AI-powered assessment to identify your current skill level and set personalized learning goals.",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02", 
      title: "Personalized Learning Path",
      description: "Get a custom study plan with adaptive content that evolves based on your progress and performance.",
      icon: Brain,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      title: "Interactive Practice",
      description: "Engage with hands-on coding challenges, real-world projects, and instant feedback systems.",
      icon: Code2,
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      title: "Track & Achieve",
      description: "Monitor your progress with detailed analytics, earn achievements, and reach your coding goals.",
      icon: Award,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your personalized learning journey in just 4 simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="text-center">
                <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-r mb-6 flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 transition-transform duration-200", step.color)}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="mb-4">
                  <span className={cn("text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent", step.color)}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfessionalTestimonials() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Engineer at Google",
      content: "SmartCode Mentor's AI-powered approach helped me transition from frontend to full-stack development in just 3 months. The personalized learning path was exactly what I needed.",
      avatar: "AC",
      rating: 5,
      company: "Google"
    },
    {
      name: "Sarah Johnson", 
      role: "CS Student at Stanford",
      content: "The adaptive questions feature is incredible. It always challenges me at the perfect level, and the progress tracking keeps me motivated every day.",
      avatar: "SJ",
      rating: 5,
      company: "Stanford"
    },
    {
      name: "Mike Rodriguez",
      role: "Lead Developer at Microsoft", 
      content: "As a self-taught developer, I struggled with structured learning. This platform gave me the roadmap I needed to advance my career significantly.",
      avatar: "MR",
      rating: 5,
      company: "Microsoft"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Developers Worldwide</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of developers who have accelerated their coding journey with SmartCode Mentor
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-semibold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-blue-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModernCTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20"></div>
      
      <div className="container mx-auto px-6 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Transform Your 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Coding Journey?</span>
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who are already accelerating their skills with our AI-powered learning platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              onClick={onGetStarted} 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="h-5 w-5 mr-2" />
              Start Learning Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-10 py-4 text-lg rounded-xl backdrop-blur-sm"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-gray-300">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">24/7</div>
              <div className="text-gray-300">AI Support</div>
            </div>
          </div>
          
          <p className="text-sm mt-8 opacity-75">No credit card required • 7-day free trial • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
