import { Link, useLocation } from 'react-router-dom';
import { TreePine, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ChristmasLights from './ChristmasLights';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/register', label: 'Register' },
    { href: '/login', label: 'Login' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <ChristmasLights />
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <TreePine className="w-8 h-8 text-christmas-green animate-bounce-gentle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-christmas-gold rounded-full animate-twinkle" />
            </div>
            <span className="text-xl font-display font-bold">
              <span className="text-christmas-red">Numreno</span>
              <span className="text-christmas-green">Hacks</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-christmas-gold ${
                  isActive(link.href) ? 'text-christmas-gold' : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/register">
              <Button className="bg-christmas-red hover:bg-christmas-red/90 text-white glow-red flex items-center gap-2">
                <TreePine className="w-4 h-4" /> Join Now
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-christmas-gold ${
                    isActive(link.href) ? 'text-christmas-gold' : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-christmas-red hover:bg-christmas-red/90 text-white">
                  🎄 Join Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
