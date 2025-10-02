import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, TrendingUp, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Optimization",
      description: "Machine learning algorithms optimize traffic flow, reducing congestion by up to 30%"
    },
    {
      icon: Zap,
      title: "Smart Energy Grid",
      description: "Real-time monitoring and predictive analytics for sustainable energy management"
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Insights",
      description: "Comprehensive analytics dashboard with actionable intelligence for city planning"
    },
    {
      icon: Shield,
      title: "Secure & Scalable",
      description: "Enterprise-grade security with infrastructure that grows with your city"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              Next-Generation Urban Intelligence
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Optimize the City of
              <span className="block text-gradient-primary">Tomorrow, Today</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore how AI and IoT transform urban living—simulate, analyze, and innovate with real-time data visualization and intelligent automation.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                  Explore the City
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                </Button>
              </Link>
              <Link to="/analytics">
                <Button size="lg" variant="outline" className="border-border hover:border-primary">
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Intelligent Infrastructure</h2>
            <p className="text-lg text-muted-foreground">
              Powered by cutting-edge technology and real-time data processing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-smooth animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your City?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join researchers, planners, and innovators using AI to build smarter cities
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Simulation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
