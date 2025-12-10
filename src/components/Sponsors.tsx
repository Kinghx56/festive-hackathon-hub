import { Sparkles, Building2, Rocket, Cloud, Database, Zap, Wrench, Lightbulb, Star, Brain, Gift, Award, Trophy } from 'lucide-react';

const Sponsors = () => {
  // Mock sponsor data - replace with actual logos
  const sponsors = {
    title: [
      { name: 'TechCorp', icon: Building2 },
      { name: 'InnovateLabs', icon: Rocket },
    ],
    platinum: [
      { name: 'CloudServe', icon: Cloud },
      { name: 'DataSystems', icon: Database },
      { name: 'CodeCraft', icon: Zap },
    ],
    gold: [
      { name: 'DevTools Inc', icon: Wrench },
      { name: 'StartupHub', icon: Lightbulb },
      { name: 'TechVentures', icon: Star },
      { name: 'BrightMind', icon: Brain },
    ],
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-christmas-gold animate-sparkle" />
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Our Amazing <span className="text-christmas-gold">Sponsors</span>
            </h2>
            <Sparkles className="w-6 h-6 text-christmas-gold animate-sparkle" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A big thank you to our generous sponsors who make this hackathon possible!
          </p>
        </div>

        {/* Title Sponsors */}
        <div className="mb-12">
          <h3 className="text-center text-xl font-display font-semibold text-christmas-red mb-6 flex items-center justify-center gap-2">
            <Gift className="w-6 h-6" /> Title Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {sponsors.title.map((sponsor, index) => (
              <div
                key={index}
                className="glass-card p-6 min-w-[150px] hover:scale-105 transition-transform christmas-border"
              >
                <div className="text-center">
                  <sponsor.icon className="w-12 h-12 mx-auto mb-2 text-christmas-gold" />
                  <p className="font-display font-semibold text-sm">{sponsor.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platinum Sponsors */}
        <div className="mb-12">
          <h3 className="text-center text-xl font-display font-semibold text-christmas-gold mb-6 flex items-center justify-center gap-2">
            <Award className="w-6 h-6" /> Platinum Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.platinum.map((sponsor, index) => (
              <div
                key={index}
                className="glass-card p-6 min-w-[150px] hover:scale-105 transition-transform"
              >
                <div className="text-center">
                  <sponsor.icon className="w-16 h-16 mx-auto mb-3 text-christmas-gold" />
                  <p className="font-display font-medium">{sponsor.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div>
          <h3 className="text-center text-xl font-display font-semibold text-christmas-green mb-6 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" /> Gold Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {sponsors.gold.map((sponsor, index) => (
              <div
                key={index}
                className="glass-card p-4 min-w-[120px] hover:scale-105 transition-transform"
              >
                <div className="text-center">
                  <sponsor.icon className="w-10 h-10 mx-auto mb-2 text-christmas-green" />
                  <p className="font-display text-sm">{sponsor.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto christmas-border">
            <h3 className="text-2xl font-display font-bold mb-4">
              Want to Sponsor NumrenoHacks?
            </h3>
            <p className="text-muted-foreground mb-6">
              Partner with us to empower the next generation of innovators and get your
              brand in front of talented developers.
            </p>
            <a
              href="mailto:sponsors@numrenohacks.com"
              className="inline-block bg-christmas-gold hover:bg-christmas-gold/90 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Become a Sponsor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
