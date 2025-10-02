import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import KPICard from "@/components/KPICard";
import CityVisualization from "@/components/CityVisualization";
import AITrainingPanel from "@/components/AITrainingPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  Zap, 
  Droplets, 
  Wind, 
  Play,
  Brain,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { aiModel } from "@/lib/aiModel";
import { db } from "@/lib/database";

const Dashboard = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [predictions, setPredictions] = useState<{
    traffic?: number;
    energy?: number;
    recommendations: string[];
  }>({ recommendations: [] });
  
  useEffect(() => {
    // Initialize database
    db.init().catch(console.error);
  }, []);
  
  const kpis = [
    {
      title: "Traffic Flow",
      value: "87%",
      change: "+12% from baseline",
      icon: Car,
      trend: "up" as const
    },
    {
      title: "Energy Efficiency",
      value: "12.4k kWh",
      change: "8.4 tons CO₂ saved",
      icon: Zap,
      trend: "up" as const
    },
    {
      title: "Water Usage",
      value: "94%",
      change: "6% reduction",
      icon: Droplets,
      trend: "up" as const
    },
    {
      title: "Air Quality",
      value: "Good",
      change: "PM2.5: 42 μg/m³",
      icon: Wind,
      trend: "up" as const
    }
  ];

  const runPrediction = async (type: "traffic" | "energy") => {
    if (!aiModel.isModelTrained(type)) {
      toast.error("Model not trained", {
        description: `Please train the ${type} AI model first`
      });
      return;
    }

    setIsSimulating(true);
    toast.info(`Running ${type} prediction...`, {
      description: "AI is analyzing current conditions"
    });

    try {
      // Get current conditions
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();
      
      let prediction: number;
      let currentValue: number;

      if (type === "traffic") {
        const weather = Math.random() > 0.7 ? 1 : 0;
        prediction = await aiModel.predictTraffic(hour, dayOfWeek, weather);
        currentValue = Math.round(Math.random() * 30 + 60); // Mock current
        
        // Save to database
        await db.addSimulation({
          timestamp: Date.now(),
          type: "traffic",
          prediction,
          actual: currentValue,
          scenario: "Real-time prediction",
          metrics: { hour, dayOfWeek, weather }
        });
      } else {
        const temperature = Math.round(Math.random() * 15 + 15);
        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1 : 0;
        prediction = await aiModel.predictEnergy(hour, temperature, isWeekday);
        currentValue = Math.round(Math.random() * 2000 + 6000); // Mock current
        
        // Save to database
        await db.addSimulation({
          timestamp: Date.now(),
          type: "energy",
          prediction,
          actual: currentValue,
          metrics: { hour, temperature, isWeekday }
        });
      }

      // Get recommendations
      const recommendations = aiModel.getRecommendations(type, currentValue, prediction);
      
      setPredictions(prev => ({
        ...prev,
        [type]: prediction,
        recommendations: type === "traffic" ? recommendations : prev.recommendations
      }));

      setIsSimulating(false);
      toast.success("Prediction complete!", {
        description: `Predicted ${type === "traffic" ? "congestion" : "demand"}: ${prediction}${type === "traffic" ? "%" : " kWh"}`
      });
    } catch (error) {
      console.error("Prediction error:", error);
      setIsSimulating(false);
      toast.error("Prediction failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 px-6 pb-12">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">City Control Center</h1>
            <p className="text-muted-foreground">
              Real-time monitoring and AI-powered optimization
            </p>
          </div>

          {/* KPI Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <KPICard {...kpi} />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* 3D City Visualization */}
            <Card className="lg:col-span-2 bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Live 3D City Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <CityVisualization />
                </div>
                
                {/* Map Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Buildings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">Energy Stations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">Vehicles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Training Panel */}
            <AITrainingPanel />
          </div>

          {/* AI Predictions & Controls */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Prediction Results */}
            <Card className="lg:col-span-2 bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Traffic Congestion</span>
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-3xl font-bold">
                      {predictions.traffic ? `${predictions.traffic}%` : "--"}
                    </p>
                    <Button
                      onClick={() => runPrediction("traffic")}
                      disabled={isSimulating}
                      size="sm"
                      className="w-full mt-3"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Predict Traffic
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Energy Demand</span>
                      <Zap className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="text-3xl font-bold">
                      {predictions.energy ? `${predictions.energy} kWh` : "--"}
                    </p>
                    <Button
                      onClick={() => runPrediction("energy")}
                      disabled={isSimulating}
                      size="sm"
                      className="w-full mt-3"
                      variant="secondary"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Predict Energy
                    </Button>
                  </div>
                </div>

                {/* AI Recommendations */}
                {predictions.recommendations.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold mb-3">AI Recommendations</h4>
                    <div className="space-y-2">
                      {predictions.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Real-Time Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Active Sensors</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <p className="text-xs text-muted-foreground mb-1">Data Points/sec</p>
                  <p className="text-2xl font-bold">1,524</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-xs text-muted-foreground mb-1">AI Predictions</p>
                  <p className="text-2xl font-bold">{predictions.traffic && predictions.energy ? 2 : predictions.traffic || predictions.energy ? 1 : 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
