const ChristmasLights = () => {
  const colors = ['christmas-red', 'christmas-gold', 'christmas-green', 'christmas-candy'];
  const lightCount = 20;

  return (
    <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
      <div className="flex justify-between items-start px-4">
        {Array.from({ length: lightCount }).map((_, i) => {
          const color = colors[i % colors.length];
          const delay = i * 0.2;
          return (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ animationDelay: `${delay}s` }}
            >
              <div className="w-px h-3 bg-muted-foreground/30" />
              <div
                className={`w-3 h-4 rounded-b-full bg-${color} animate-twinkle`}
                style={{
                  animationDelay: `${delay}s`,
                  boxShadow: `0 0 10px hsl(var(--${color}) / 0.8), 0 0 20px hsl(var(--${color}) / 0.5)`,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Wire */}
      <svg className="absolute top-3 left-0 w-full h-6" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path
          d="M0,5 Q5,8 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5"
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.3)"
          strokeWidth="0.3"
        />
      </svg>
    </div>
  );
};

export default ChristmasLights;
