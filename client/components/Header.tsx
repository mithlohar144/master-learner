import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { BookOpen, Brain, CalendarDays, ChartLine, HelpCircle, LayoutGrid, Sparkles, Swords, Sun, Moon, Bell, User, Settings, LogOut, Flame, Star, Trophy } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useState, useEffect } from "react";

const nav = [
  { id: "timetable", label: "Timetable", icon: CalendarDays },
  { id: "questions", label: "AI Questions", icon: Brain },
  { id: "trending", label: "Trending", icon: ChartLine },
  { id: "doubts", label: "Doubts", icon: HelpCircle },
  { id: "flowchart", label: "Flowcharts", icon: LayoutGrid },
  { id: "study", label: "Study", icon: BookOpen },
  { id: "progress", label: "Progress", icon: Swords },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors shadow-sm"
    >
      {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-gray-600" />}
    </button>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'achievement', message: '5-day streak achieved!', unread: true },
    { id: 2, type: 'reminder', message: 'Daily practice session available', unread: true },
    { id: 3, type: 'milestone', message: 'You completed Arrays topic!', unread: false }
  ]);
  
  const isLandingPage = pathname === "/" || pathname === "/legacy";
  const isDashboard = pathname === "/dashboard";
  const isAppPage = !isLandingPage && userProfile; // Any page within the app
  const unreadCount = notifications.filter(n => n.unread).length;
  
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, [pathname]);
  
  const handleSignOut = () => {
    localStorage.removeItem('userProfile');
    window.location.href = '/';
  };
  
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SmartCode Mentor
          </span>
        </Link>
        
        {/* Legacy navigation for old index page */}
        {pathname === "/legacy" && (
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
                )}
              >
                <n.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                {n.label}
              </a>
            ))}
          </nav>
        )}

        {/* App navigation */}
        {isAppPage && (
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={cn(
                "group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/dashboard" 
                  ? "text-purple-600 bg-purple-50 shadow-sm" 
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              )}
            >
              <LayoutGrid className={cn(
                "h-4 w-4 transition-colors",
                pathname === "/dashboard" ? "text-purple-600" : "text-gray-500 group-hover:text-purple-600"
              )} />
              Dashboard
            </Link>
            <Link
              to="/timetable"
              className={cn(
                "group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/timetable" 
                  ? "text-purple-600 bg-purple-50 shadow-sm" 
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              )}
            >
              <CalendarDays className={cn(
                "h-4 w-4 transition-colors",
                pathname === "/timetable" ? "text-purple-600" : "text-gray-500 group-hover:text-purple-600"
              )} />
              Timetable
            </Link>
            <Link
              to="/challenge"
              className={cn(
                "group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/challenge" 
                  ? "text-purple-600 bg-purple-50 shadow-sm" 
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              )}
            >
              <Trophy className={cn(
                "h-4 w-4 transition-colors",
                pathname === "/challenge" ? "text-purple-600" : "text-gray-500 group-hover:text-purple-600"
              )} />
              Challenges
            </Link>
            <Link
              to="/learn"
              className={cn(
                "group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/learn" 
                  ? "text-purple-600 bg-purple-50 shadow-sm" 
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              )}
            >
              <BookOpen className={cn(
                "h-4 w-4 transition-colors",
                pathname === "/learn" ? "text-purple-600" : "text-gray-500 group-hover:text-purple-600"
              )} />
              Learn
            </Link>
          </nav>
        )}
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Notifications for app users */}
          {isAppPage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-semibold">Notifications</div>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={cn(
                      "p-3 cursor-pointer",
                      notification.unread && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "p-1 rounded-full",
                        notification.type === 'achievement' ? "bg-orange-500/10" :
                        notification.type === 'milestone' ? "bg-green-500/10" : "bg-blue-500/10"
                      )}>
                        {notification.type === 'achievement' ? <Flame className="h-3 w-3 text-orange-500" /> :
                         notification.type === 'milestone' ? <Star className="h-3 w-3 text-green-500" /> :
                         <Bell className="h-3 w-3 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{notification.message}</div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* User profile dropdown for app users */}
          {isAppPage && userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userProfile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.experience} level
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/timetable" className="cursor-pointer">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    My Timetable
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/challenge" className="cursor-pointer">
                    <Trophy className="mr-2 h-4 w-4" />
                    Challenges
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/learn" className="cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learn
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Get Started button for landing page */}
          {isLandingPage && (
            <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <Link to="/onboarding" className="font-semibold">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
