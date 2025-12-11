import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Calendar,
  Trophy,
  ExternalLink,
  ChevronRight,
  TreePine,
  Crown,
  Loader2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Snowfall from '@/components/Snowfall';
import Stars from '@/components/Stars';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SnowGlobe from '@/components/SnowGlobe';
import { playSuccessJingle } from '@/utils/sounds';
import CountdownTimer from '@/components/CountdownTimer';
import { TeamData } from '@/services/firestore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [snowGlobeActive, setSnowGlobeActive] = useState(false);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSnowGlobeActive(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch team data from Firebase
  useEffect(() => {
    const teamEmail = sessionStorage.getItem('teamEmail');
    const teamPhone = sessionStorage.getItem('teamPhone');

    if (!teamEmail || !teamPhone) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    // Real-time listener for team data
    const teamsRef = collection(db, 'teams');
    const q = query(
      teamsRef,
      where('teamLeadEmail', '==', teamEmail),
      where('teamLeadPhone', '==', teamPhone)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          toast.error('Team not found');
          navigate('/login');
          return;
        }

        const teamDoc = querySnapshot.docs[0];
        const team = { id: teamDoc.id, ...teamDoc.data() } as TeamData & { id: string };
        setTeamData(team);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching team data:', error);
        toast.error('Failed to load team data');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  const announcements = [
    { id: 1, title: 'Workshop: Building with AI APIs', date: 'Dec 18', isNew: true },
    { id: 2, title: 'Submission guidelines updated', date: 'Dec 17', isNew: true },
    { id: 3, title: 'Discord server is now live!', date: 'Dec 16', isNew: false },
  ];

  const hackathonDate = new Date('2025-12-24T09:00:00');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-2 text-christmas-green">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Approved</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-2 text-christmas-gold">
            <Clock className="w-5 h-5 animate-spin-slow" />
            <span className="font-medium">Under Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <Snowfall />
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-christmas-red mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <Snowfall />
        <div className="text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Team data not found</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Snowfall />
      <div className="dark:block hidden">
        <Stars />
      </div>
      <ThemeToggle />
      <MusicPlayer />
      <SnowGlobe active={snowGlobeActive} onComplete={() => setSnowGlobeActive(false)} />
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Header */}
          <div className="glass-card p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  <span className="flex items-center gap-2">
                    Ho Ho Ho, <span className="text-christmas-red">{teamData.teamName}</span>! <TreePine className="w-6 h-6 text-christmas-green" />
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Team ID: <span className="text-christmas-gold font-mono">{teamData.teamId}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(teamData.status)}
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-christmas-red data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="team" className="rounded-lg data-[state=active]:bg-christmas-red data-[state=active]:text-white">
                Team
              </TabsTrigger>
              <TabsTrigger value="project" className="rounded-lg data-[state=active]:bg-christmas-red data-[state=active]:text-white">
                Project
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-christmas-red data-[state=active]:text-white">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Countdown Card */}
                <div className="lg:col-span-2 glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-christmas-gold" />
                    Time Until Hackathon
                  </h3>
                  <CountdownTimer targetDate={hackathonDate} label="" />
                </div>

                {/* Quick Stats */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-christmas-gold" />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Team Members</span>
                      <span className="font-semibold text-christmas-green">{teamData.members.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Track</span>
                      <span className="font-semibold text-christmas-gold">AI/ML</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-semibold text-christmas-green">Approved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-christmas-gold" />
                  Announcements
                </h3>
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div 
                      key={announcement.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {announcement.isNew && (
                          <span className="w-2 h-2 rounded-full bg-christmas-red animate-twinkle" />
                        )}
                        <span>{announcement.title}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">{announcement.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Dates */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-christmas-gold" />
                  Important Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { date: 'Dec 20', event: 'Registration Closes', icon: Clock },
                    { date: 'Dec 24', event: 'Hackathon Begins', icon: TreePine },
                    { date: 'Dec 25', event: 'Submissions Due', icon: FileText },
                    { date: 'Dec 26', event: 'Results', icon: Trophy },
                  ].map((item) => (
                    <div key={item.event} className="text-center p-4 bg-muted/30 rounded-lg">
                      <item.icon className="w-8 h-8 mx-auto mb-2 text-christmas-gold" />
                      <div className="font-semibold text-christmas-gold">{item.date}</div>
                      <div className="text-sm text-muted-foreground">{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-christmas-gold" />
                  Team Members
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {teamData.members.map((member, index) => (
                    <div key={member.email} className="christmas-border rounded-xl p-4 bg-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-christmas-green/20 flex items-center justify-center text-lg">
                          {index === 0 ? <Crown className="w-5 h-5 text-christmas-gold" /> : <TreePine className="w-5 h-5 text-christmas-green" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-christmas-green">{member.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      {index === 0 && (
                        <span className="inline-block mt-2 text-xs bg-christmas-gold/20 text-christmas-gold px-2 py-1 rounded-full">
                          Team Lead
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Team Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Institution</p>
                    <p className="font-medium">{teamData.institutionName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Registered On</p>
                    <p className="font-medium">{teamData.registeredAt}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="project" className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-christmas-gold" />
                  Project Details
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Project Title</p>
                    <h4 className="text-xl font-display font-semibold text-christmas-gold">
                      {teamData.projectTitle}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Track</p>
                      <p className="font-medium">{teamData.problemStatementId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Tech Stack</p>
                      <p className="font-medium">{teamData.techStack}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Description</p>
                    <p className="text-foreground">{teamData.projectDescription}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Submit Your Project</h3>
                <p className="text-muted-foreground mb-6">
                  Project submission will open when the hackathon begins on December 24th.
                </p>
                <Button disabled className="bg-muted text-muted-foreground">
                  📦 Submission Opens Dec 24
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-christmas-gold" />
                  Account Settings
                </h3>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-between border-border hover:bg-muted">
                    Change Password
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between border-border hover:bg-muted">
                    Email Preferences
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between border-border hover:bg-muted">
                    Download Registration Certificate
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="glass-card p-6 border-destructive/50">
                <h3 className="font-display font-semibold text-lg mb-4 text-destructive">Danger Zone</h3>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
