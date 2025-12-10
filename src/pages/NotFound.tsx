import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TreePine, Home, Snowflake } from "lucide-react";
import Snowfall from "@/components/Snowfall";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <Snowfall />
      
      <div className="text-center px-4 relative z-10">
        <div className="mb-8 relative inline-block">
          <span className="text-9xl font-display font-bold text-gradient-christmas">404</span>
          <Snowflake className="absolute -top-4 -right-8 w-12 h-12 text-christmas-ice animate-spin-slow" />
          <TreePine className="absolute -bottom-4 -left-8 w-16 h-16 text-christmas-green animate-bounce-gentle" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Oops! Lost in the <span className="text-christmas-red">Snow</span>! ❄️
        </h1>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Looks like Santa's sleigh took a wrong turn. This page doesn't exist in our winter wonderland!
        </p>
        
        <Link to="/">
          <Button className="bg-christmas-red hover:bg-christmas-red/90 text-white glow-red">
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </Link>
        
        <div className="mt-12 font-script text-christmas-gold text-xl">
          ✨ May your journey be merry and bright! ✨
        </div>
      </div>
    </div>
  );
};

export default NotFound;
