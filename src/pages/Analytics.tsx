import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Zap, Activity, Database, RefreshCcw } from "lucide-react";
import { db, SimulationRecord } from "@/lib/database";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

const Analytics = () => {
  const [predictions, setPredictions] = useState<SimulationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const recent = await db.getRecentSimulations(24);
      setPredictions(recent);
    } catch (error) {
      console.error("Failed to load predictions:", error);
      toast.error("Failed to load prediction history");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await db.clearSimulations();
      setPredictions([]);
      toast.success("Prediction history cleared");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Failed to clear history");
    }
  };

  // Transform DB data for charts
  const trafficPredictions = predictions
    .filter(p => p.type === "traffic")
    .slice(-10)
    .map((p, idx) => ({
      time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predicted: p.prediction,
      actual: p.actual || 0
    }));

  const energyPredictions = predictions
    .filter(p => p.type === "energy")
    .slice(-10)
    .map((p, idx) => ({
      time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      predicted: p.prediction,
      actual: p.actual || 0
    }));

  const trafficData = [
    { time: "00:00", flow: 45, aiOptimized: 52 },
    { time: "04:00", flow: 32, aiOptimized: 38 },
    { time: "08:00", flow: 78, aiOptimized: 91 },
    { time: "12:00", flow: 85, aiOptimized: 95 },
    { time: "16:00", flow: 92, aiOptimized: 98 },
    { time: "20:00", flow: 67, aiOptimized: 78 },
  ];

  const energyData = [
    { month: "Jan", consumption: 12400, aiSaved: 1200 },
    { month: "Feb", consumption: 11800, aiSaved: 1400 },
    { month: "Mar", consumption: 10900, aiSaved: 1600 },
    { month: "Apr", consumption: 10200, aiSaved: 1800 },
    { month: "May", consumption: 9800, aiSaved: 2000 },
    { month: "Jun", consumption: 9200, aiSaved: 2200 },
  ];

  const servicesData = [
    { service: "Waste", efficiency: 88 },
    { service: "Water", efficiency: 94 },
    { service: "Lighting", efficiency: 91 },
    { service: "Transport", efficiency: 87 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 px-6 pb-12">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Deep insights into city performance and AI optimization impact
            </p>
          </div>

          {/* AI Predictions History */}
          <Card className="bg-card border-border/50 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  AI Prediction History ({predictions.length} records)
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={loadPredictions} disabled={loading}>
                    <RefreshCcw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearHistory} disabled={predictions.length === 0}>
                    Clear History
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading predictions...</p>
              ) : predictions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No predictions yet. Go to Dashboard and run some AI predictions!
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Traffic Predictions */}
                  {trafficPredictions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Traffic Predictions (Last 10)</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={trafficPredictions}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 25%)" />
                          <XAxis dataKey="time" stroke="hsl(210 20% 65%)" fontSize={10} />
                          <YAxis stroke="hsl(210 20% 65%)" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(220 20% 14%)', 
                              border: '1px solid hsl(220 20% 25%)',
                              borderRadius: '0.5rem'
                            }} 
                          />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Line type="monotone" dataKey="predicted" stroke="hsl(210 100% 50%)" name="Predicted %" />
                          <Line type="monotone" dataKey="actual" stroke="hsl(150 60% 40%)" name="Actual %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Energy Predictions */}
                  {energyPredictions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Energy Predictions (Last 10)</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={energyPredictions}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 25%)" />
                          <XAxis dataKey="time" stroke="hsl(210 20% 65%)" fontSize={10} />
                          <YAxis stroke="hsl(210 20% 65%)" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(220 20% 14%)', 
                              border: '1px solid hsl(220 20% 25%)',
                              borderRadius: '0.5rem'
                            }} 
                          />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Line type="monotone" dataKey="predicted" stroke="hsl(210 100% 50%)" name="Predicted kWh" />
                          <Line type="monotone" dataKey="actual" stroke="hsl(150 60% 40%)" name="Actual kWh" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="traffic" className="space-y-6">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="traffic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Activity className="w-4 h-4 mr-2" />
                Traffic
              </TabsTrigger>
              <TabsTrigger value="energy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Zap className="w-4 h-4 mr-2" />
                Energy
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
            </TabsList>

            <TabsContent value="traffic" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-3xl font-bold">30%</p>
                      <p className="text-sm text-muted-foreground">Congestion Reduction</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-secondary" />
                      <p className="text-3xl font-bold">87%</p>
                      <p className="text-sm text-muted-foreground">Average Flow Rate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <p className="text-3xl font-bold">22%</p>
                      <p className="text-sm text-muted-foreground">Time Saved</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Traffic Flow: Before vs After AI Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(210 100% 50%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(210 100% 50%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(150 60% 40%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(150 60% 40%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 25%)" />
                      <XAxis dataKey="time" stroke="hsl(210 20% 65%)" />
                      <YAxis stroke="hsl(210 20% 65%)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220 20% 14%)', 
                          border: '1px solid hsl(220 20% 25%)',
                          borderRadius: '0.5rem'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="flow" 
                        stroke="hsl(210 100% 50%)" 
                        fill="url(#flowGradient)" 
                        name="Baseline Flow %" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="aiOptimized" 
                        stroke="hsl(150 60% 40%)" 
                        fill="url(#aiGradient)" 
                        name="AI Optimized %" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="energy" className="space-y-6">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Energy Consumption & AI Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 25%)" />
                      <XAxis dataKey="month" stroke="hsl(210 20% 65%)" />
                      <YAxis stroke="hsl(210 20% 65%)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220 20% 14%)', 
                          border: '1px solid hsl(220 20% 25%)',
                          borderRadius: '0.5rem'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="consumption" fill="hsl(210 100% 50%)" name="Total Consumption (kWh)" />
                      <Bar dataKey="aiSaved" fill="hsl(150 60% 40%)" name="AI Saved (kWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Monthly Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm text-muted-foreground mb-1">Energy Saved</p>
                        <p className="text-2xl font-bold">12,000 kWh</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-sm text-muted-foreground mb-1">CO₂ Reduction</p>
                        <p className="text-2xl font-bold">8.4 tons</p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-sm text-muted-foreground mb-1">Cost Savings</p>
                        <p className="text-2xl font-bold">$1,680</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-1">Peak Load Shift</p>
                        <p className="text-xs text-muted-foreground">
                          Move 15% of non-critical loads to off-peak hours
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-1">Solar Integration</p>
                        <p className="text-xs text-muted-foreground">
                          Increase solar grid contribution by 12%
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-1">Grid Balancing</p>
                        <p className="text-xs text-muted-foreground">
                          Optimize battery storage discharge timing
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Public Services Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={servicesData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 25%)" />
                      <XAxis type="number" stroke="hsl(210 20% 65%)" />
                      <YAxis dataKey="service" type="category" stroke="hsl(210 20% 65%)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220 20% 14%)', 
                          border: '1px solid hsl(220 20% 25%)',
                          borderRadius: '0.5rem'
                        }} 
                      />
                      <Bar dataKey="efficiency" fill="hsl(150 60% 40%)" name="Efficiency %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
