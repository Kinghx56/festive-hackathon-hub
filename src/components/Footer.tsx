import { TreePine, Heart, Github, Twitter, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <TreePine className="w-6 h-6 text-christmas-green" />
              <span className="text-lg font-display font-bold">
                <span className="text-christmas-red">Numreno</span>
                <span className="text-christmas-green">Hacks</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              The most wonderful hackathon of the year! Join us for an unforgettable 
              experience of innovation, creativity, and festive fun.
            </p>
            <p className="font-script text-christmas-gold text-lg">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> May your code be merry and bright! <Sparkles className="w-4 h-4" />
              </span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-christmas-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-christmas-red transition-colors">Home</Link></li>
              <li><Link to="/register" className="hover:text-christmas-red transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-christmas-red transition-colors">Login</Link></li>
              <li><a href="#faq" className="hover:text-christmas-red transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-christmas-gold">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-christmas-red transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-christmas-red transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:hello@numrenohacks.com" className="text-muted-foreground hover:text-christmas-red transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-christmas-red animate-bounce-gentle" /> and lots of hot cocoa
          </p>
          <p className="mt-2">© {new Date().getFullYear()} NumrenoHacks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
