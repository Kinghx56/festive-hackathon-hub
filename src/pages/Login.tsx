import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Phone, Eye, EyeOff, TreePine, Snowflake, Sparkles, Gift } from 'lucide-react';
import Header from '@/components/Header';
import Snowfall from '@/components/Snowfall';
import Stars from '@/components/Stars';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SnowGlobe from '@/components/SnowGlobe';
import { playSuccessJingle } from '@/utils/sounds';
import { toast } from 'sonner';
import { getTeamByCredentials } from '@/services/firestore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snowGlobeActive, setSnowGlobeActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSnowGlobeActive(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const result = await getTeamByCredentials(data.email, data.phone);
      
      if (!result.success || !result.team) {
        throw new Error(result.message);
      }

      // Store team info in session storage
      sessionStorage.setItem('teamId', result.team.teamId);
      sessionStorage.setItem('teamEmail', result.team.teamLeadEmail);
      sessionStorage.setItem('teamPhone', result.team.teamLeadPhone);
      sessionStorage.setItem('teamData', JSON.stringify(result.team));

      playSuccessJingle();
      toast.success('Welcome back!', {
        description: `Successfully logged in as ${result.team.teamName}`,
        icon: <TreePine className="w-5 h-5" />,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed', {
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex flex-col items-center justify-center text-center p-8">
              <div className="relative">
                <div className="mb-6 animate-float">
                  <TreePine className="w-32 h-32 mx-auto text-christmas-green" />
                </div>
                <Snowflake className="absolute -top-4 -left-8 w-8 h-8 text-christmas-ice animate-spin-slow" />
                <Snowflake className="absolute top-10 -right-12 w-6 h-6 text-christmas-snow animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                <TreePine className="absolute bottom-0 left-0 w-16 h-16 text-christmas-green opacity-50" />
                <TreePine className="absolute bottom-0 right-0 w-12 h-12 text-christmas-dark-green opacity-50" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">
                Welcome Back, <span className="text-christmas-red">Hacker!</span>
              </h2>
              <p className="text-muted-foreground font-script text-xl">
                <span className="flex items-center justify-center gap-2">
                  Santa's workshop awaits your return <Sparkles className="w-5 h-5" />
                </span>
              </p>
            </div>

            {/* Right side - Login form */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green" />
              
              <div className="text-center mb-8">
                <div className="mb-2 lg:hidden">
                  <TreePine className="w-12 h-12 mx-auto text-christmas-green" />
                </div>
                <h1 className="text-2xl font-display font-bold mb-2">
                  Team <span className="text-christmas-gold">Login</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Team Lead Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                      className="pl-10 bg-muted border-border focus:border-christmas-gold"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Password)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your registered phone number"
                      {...register('phone')}
                      className="pl-10 pr-10 bg-muted border-border focus:border-christmas-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use the phone number you registered with
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-muted-foreground data-[state=checked]:bg-christmas-green data-[state=checked]:border-christmas-green"
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-christmas-gold hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-christmas-red hover:bg-christmas-red/90 text-white glow-red"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Snowflake className="w-5 h-5 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    '🔑 Login to Dashboard'
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground text-sm mb-4">
                  Don't have an account yet?
                </p>
                <Link to="/register">
                  <Button variant="outline" className="border-christmas-green text-christmas-green hover:bg-christmas-green hover:text-white">
                    <TreePine className="w-4 h-4 inline-block mr-2" /> Register Your Team
                  </Button>
                </Link>
              </div>

              {/* Decorative elements */}
              <Gift className="absolute -bottom-4 -left-4 w-16 h-16 opacity-10 text-christmas-red" />
              <TreePine className="absolute -bottom-4 -right-4 w-16 h-16 opacity-10 text-christmas-green" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
