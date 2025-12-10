import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gift, Users, Trophy, Calendar, Sparkles, TreePine, Star } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Snowfall from '@/components/Snowfall';

const Index = () => {
  // Set hackathon date (adjust as needed)
  const hackathonDate = new Date('2025-12-25T09:00:00');

  const features = [
    {
      icon: Gift,
      title: 'Amazing Prizes',
      description: 'Win exciting prizes including cash rewards, gadgets, and exclusive swag!',
      color: 'christmas-red',
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Get guidance from industry professionals throughout the hackathon.',
      color: 'christmas-green',
    },
    {
      icon: Trophy,
      title: 'Fun Challenges',
      description: 'Tackle creative problem statements that make a real-world impact.',
      color: 'christmas-gold',
    },
    {
      icon: Sparkles,
      title: 'Networking',
      description: 'Connect with like-minded innovators and build lasting relationships.',
      color: 'christmas-candy',
    },
  ];

  const timeline = [
    { date: 'Dec 15', event: 'Registration Opens', icon: '🎄', completed: true },
    { date: 'Dec 20', event: 'Registration Closes', icon: '⏰', completed: false },
    { date: 'Dec 24', event: 'Hackathon Begins', icon: '🚀', completed: false },
    { date: 'Dec 25', event: 'Submissions Due', icon: '📦', completed: false },
    { date: 'Dec 26', event: 'Results Announced', icon: '🏆', completed: false },
  ];

  const tracks = [
    { name: 'AI & Machine Learning', emoji: '🤖', description: 'Build intelligent solutions using AI/ML technologies' },
    { name: 'Web3 & Blockchain', emoji: '⛓️', description: 'Create decentralized applications for the future' },
    { name: 'Healthcare', emoji: '🏥', description: 'Innovate solutions for better healthcare access' },
    { name: 'Sustainability', emoji: '🌱', description: 'Build apps that help save our planet' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute top-20 left-10 opacity-20">
          <TreePine className="w-32 h-32 text-christmas-green" />
        </div>
        <div className="absolute top-40 right-10 opacity-20">
          <Star className="w-24 h-24 text-christmas-gold animate-spin-slow" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-swing">
            <span className="text-6xl">🎄</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in">
            <span className="block text-foreground">Welcome to</span>
            <span className="text-gradient-christmas">NumrenoHacks</span>
          </h1>
          
          <p className="font-script text-2xl md:text-3xl text-christmas-gold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The Most Wonderful Hackathon of the Year!
          </p>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Join us for 48 hours of coding, creativity, and Christmas magic. 
            Build something amazing and compete for incredible prizes!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/register">
              <Button size="lg" className="bg-christmas-red hover:bg-christmas-red/90 text-white text-lg px-8 glow-red">
                🎁 Register Your Team
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-christmas-green text-christmas-green hover:bg-christmas-green hover:text-white text-lg px-8">
                🔑 Team Login
              </Button>
            </Link>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <CountdownTimer targetDate={hackathonDate} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Why Join <span className="text-christmas-red">Numreno</span><span className="text-christmas-green">Hacks</span>?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Experience the magic of coding with festive spirit and amazing opportunities
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:scale-105 transition-transform duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            <span className="text-christmas-gold">✨</span> Event Timeline <span className="text-christmas-gold">✨</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Mark your calendars for these important dates
          </p>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-christmas-red via-christmas-gold to-christmas-green rounded-full" />

            {timeline.map((item, index) => (
              <div
                key={item.event}
                className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="glass-card p-4 inline-block">
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <h4 className="font-display font-semibold text-christmas-gold">{item.date}</h4>
                    <p className="text-sm text-foreground">{item.event}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-christmas-gold border-4 border-background z-10 animate-glow-pulse" />
                <div className="w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            🎯 Problem Tracks
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Choose your adventure and build something amazing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tracks.map((track, index) => (
              <div
                key={track.name}
                className="christmas-border rounded-xl p-6 bg-card hover:scale-105 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-4xl mb-3">{track.emoji}</div>
                <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-christmas-gold transition-colors">
                  {track.name}
                </h3>
                <p className="text-muted-foreground text-sm">{track.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="glass-card p-12 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green" />
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to <span className="text-christmas-red">Hack</span> the Holidays?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Don't miss out on this incredible opportunity to showcase your skills, 
              learn from experts, and win amazing prizes!
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-christmas-green hover:bg-christmas-green/90 text-white text-lg px-12 glow-green">
                🎅 Register Now - It's Free!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
