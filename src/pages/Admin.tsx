import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Download,
  Eye,
  TreePine,
  Snowflake,
  Star,
  BarChart,
  Mail,
  Lock,
  LogOut
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Snowfall from '@/components/Snowfall';
import Stars from '@/components/Stars';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SnowGlobe from '@/components/SnowGlobe';
import { playSuccessJingle } from '@/utils/sounds';
import { toast } from 'sonner';

type TeamStatus = 'pending' | 'approved' | 'rejected';

interface Team {
  id: string;
  teamName: string;
  institution: string;
  leadName: string;
  leadEmail: string;
  memberCount: number;
  track: string;
  status: TeamStatus;
  registeredDate: string;
  projectTitle: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [snowGlobeActive, setSnowGlobeActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnowGlobeActive(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TeamStatus | 'all'>('all');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Check for saved session
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminAuth');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - In production, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError('');
      toast.success('Welcome, Admin!', {
        description: 'Successfully logged into admin portal.',
      });
    } else {
      setError('Incorrect password. Please try again.');
      toast.error('Access Denied', {
        description: 'Invalid admin credentials.',
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
    toast.success('Logged out successfully');
  };

  // Mock team data
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 'NH-2024-001',
      teamName: 'Code Crusaders',
      institution: 'Tech University',
      leadName: 'John Doe',
      leadEmail: 'john@example.com',
      memberCount: 3,
      track: 'AI & Machine Learning',
      status: 'pending',
      registeredDate: '2024-12-15',
      projectTitle: 'AI-Powered Study Assistant',
    },
    {
      id: 'NH-2024-002',
      teamName: 'Winter Wizards',
      institution: 'Innovation College',
      leadName: 'Jane Smith',
      leadEmail: 'jane@example.com',
      memberCount: 4,
      track: 'Web3 & Blockchain',
      status: 'approved',
      registeredDate: '2024-12-14',
      projectTitle: 'Decentralized Education Platform',
    },
    {
      id: 'NH-2024-003',
      teamName: 'Santa\'s Devs',
      institution: 'State University',
      leadName: 'Bob Johnson',
      leadEmail: 'bob@example.com',
      memberCount: 3,
      track: 'Healthcare',
      status: 'pending',
      registeredDate: '2024-12-16',
      projectTitle: 'Telemedicine Solution',
    },
    {
      id: 'NH-2024-004',
      teamName: 'Reindeer Coders',
      institution: 'Engineering Institute',
      leadName: 'Alice Williams',
      leadEmail: 'alice@example.com',
      memberCount: 2,
      track: 'Sustainability',
      status: 'rejected',
      registeredDate: '2024-12-13',
      projectTitle: 'Carbon Footprint Tracker',
    },
    {
      id: 'NH-2024-005',
      teamName: 'Festive Innovators',
      institution: 'Design Academy',
      leadName: 'Charlie Brown',
      leadEmail: 'charlie@example.com',
      memberCount: 4,
      track: 'AI & Machine Learning',
      status: 'approved',
      registeredDate: '2024-12-15',
      projectTitle: 'Smart City Analytics',
    },
  ]);

  const getStatusBadge = (status: TeamStatus) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-christmas-green/20 text-christmas-green border-christmas-green">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-christmas-gold/20 text-christmas-gold border-christmas-gold">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const handleStatusChange = (teamId: string, newStatus: TeamStatus) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, status: newStatus } : team
    ));
    
    if (newStatus === 'approved') playSuccessJingle();
    
    const statusMessages = {
      approved: 'Team approved successfully!',
      rejected: 'Team registration rejected.',
      pending: 'Team status set to pending.',
    };
    
    toast.success(statusMessages[newStatus], {
      description: `Team ${teamId} has been updated.`,
    });
    
    setShowDetailsDialog(false);
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: teams.length,
    pending: teams.filter(t => t.status === 'pending').length,
    approved: teams.filter(t => t.status === 'approved').length,
    rejected: teams.filter(t => t.status === 'rejected').length,
  };

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsDialog(true);
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowfall />
        <div className="dark:block hidden">
          <Stars />
        </div>
        <ThemeToggle />
        <Header />

        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-md">
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-christmas-red via-christmas-white to-christmas-red" />
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-christmas-red/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-christmas-red" />
                </div>
                <h1 className="text-2xl font-display font-bold mb-2">
                  Admin <span className="text-christmas-red">Access</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  Please enter your admin credentials to continue
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted border-border"
                    required
                  />
                  {error && (
                    <p className="text-destructive text-sm">{error}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-christmas-red hover:bg-christmas-red/90 text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Authorized personnel only. Unauthorized access is prohibited.
                </p>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      <div className="dark:block hidden">
        <Stars />
      </div>
      <ThemeToggle />
      <MusicPlayer />
      <SnowGlobe active={snowGlobeActive} onComplete={() => setSnowGlobeActive(false)} />
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Admin Header */}
          <div className="glass-card p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-christmas-red via-christmas-white to-christmas-red" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-christmas-red/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-christmas-red" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold">
                    Admin <span className="text-christmas-red">Portal</span>
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Manage team registrations for NumrenoHacks
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 christmas-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Teams</p>
                  <p className="text-3xl font-bold text-christmas-white">{stats.total}</p>
                </div>
                <Users className="w-10 h-10 text-christmas-white opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-christmas-gold/10 border-christmas-gold">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Pending</p>
                  <p className="text-3xl font-bold text-christmas-gold">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-christmas-gold opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-christmas-green/10 border-christmas-green">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Approved</p>
                  <p className="text-3xl font-bold text-christmas-green">{stats.approved}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-christmas-green opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-destructive/10 border-destructive">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-destructive">{stats.rejected}</p>
                </div>
                <XCircle className="w-10 h-10 text-destructive opacity-50" />
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="glass-card p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/50 mb-6">
                <TabsTrigger 
                  value="registrations" 
                  className="data-[state=active]:bg-christmas-red data-[state=active]:text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Registrations
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-christmas-red data-[state=active]:text-white"
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registrations" className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search teams, institutions, or leaders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TeamStatus | 'all')}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-christmas-green text-christmas-green hover:bg-christmas-green hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Teams Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead>Team ID</TableHead>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>Lead</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeams.map((team) => (
                        <TableRow key={team.id} className="hover:bg-muted/20">
                          <TableCell className="font-mono text-sm text-christmas-gold">
                            {team.id}
                          </TableCell>
                          <TableCell className="font-medium">{team.teamName}</TableCell>
                          <TableCell className="text-muted-foreground">{team.institution}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{team.leadName}</span>
                              <span className="text-xs text-muted-foreground">{team.leadEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell>{team.memberCount}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{team.track}</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(team.status)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(team)}
                              className="hover:bg-christmas-red hover:text-white hover:border-christmas-red"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredTeams.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No teams found matching your criteria.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center py-12">
                  <BarChart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-display font-bold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and insights coming soon!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Team Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <TreePine className="w-6 h-6 text-christmas-green" />
              Team Details
            </DialogTitle>
            <DialogDescription>
              Review and manage team registration
            </DialogDescription>
          </DialogHeader>

          {selectedTeam && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Team ID</p>
                  <p className="font-mono text-christmas-gold">{selectedTeam.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(selectedTeam.status)}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Team Name</p>
                <p className="text-lg font-semibold">{selectedTeam.teamName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Project Title</p>
                <p className="font-medium text-christmas-white">{selectedTeam.projectTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Institution</p>
                  <p>{selectedTeam.institution}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Track</p>
                  <p>{selectedTeam.track}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Team Lead</p>
                  <p>{selectedTeam.leadName}</p>
                  <p className="text-sm text-muted-foreground">{selectedTeam.leadEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Team Size</p>
                  <p>{selectedTeam.memberCount} members</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                <p>{new Date(selectedTeam.registeredDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            {selectedTeam && selectedTeam.status !== 'approved' && (
              <Button
                onClick={() => handleStatusChange(selectedTeam.id, 'approved')}
                className="w-full sm:w-auto bg-christmas-green hover:bg-christmas-green/90 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Team
              </Button>
            )}
            {selectedTeam && selectedTeam.status !== 'rejected' && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange(selectedTeam.id, 'rejected')}
                className="w-full sm:w-auto"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Team
              </Button>
            )}
            {selectedTeam && selectedTeam.status !== 'pending' && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange(selectedTeam.id, 'pending')}
                className="w-full sm:w-auto border-christmas-gold text-christmas-gold hover:bg-christmas-gold hover:text-black"
              >
                <Clock className="w-4 h-4 mr-2" />
                Set Pending
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
