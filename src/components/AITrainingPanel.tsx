import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { aiModel, ModelType } from "@/lib/aiModel";
import { toast } from "sonner";

export default function AITrainingPanel() {
  const [trainingStatus, setTrainingStatus] = useState<{
    traffic: { trained: boolean; training: boolean; progress: number; loss: number };
    energy: { trained: boolean; training: boolean; progress: number; loss: number };
  }>({
    traffic: { trained: false, training: false, progress: 0, loss: 0 },
    energy: { trained: false, training: false, progress: 0, loss: 0 }
  });

  const trainModel = async (type: ModelType) => {
    setTrainingStatus(prev => ({
      ...prev,
      [type]: { ...prev[type], training: true, progress: 0 }
    }));

    toast.info(`Training ${type} AI model...`, {
      description: "This will take about 10-15 seconds"
    });

    try {
      const trainFunc = type === "traffic" 
        ? aiModel.trainTrafficModel.bind(aiModel)
        : aiModel.trainEnergyModel.bind(aiModel);

      await trainFunc((progress) => {
        setTrainingStatus(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            progress: (progress.epoch / 50) * 100,
            loss: progress.loss
          }
        }));
      });

      setTrainingStatus(prev => ({
        ...prev,
        [type]: { trained: true, training: false, progress: 100, loss: prev[type].loss }
      }));

      toast.success(`${type === "traffic" ? "Traffic" : "Energy"} AI model trained!`, {
        description: `Model ready for predictions with loss: ${trainingStatus[type].loss.toFixed(4)}`
      });
    } catch (error) {
      console.error("Training error:", error);
      setTrainingStatus(prev => ({
        ...prev,
        [type]: { ...prev[type], training: false }
      }));
      toast.error("Training failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Model Training
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Traffic Model */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-medium">Traffic Prediction</span>
            </div>
            {trainingStatus.traffic.trained && (
              <CheckCircle className="w-4 h-4 text-secondary" />
            )}
          </div>
          
          {trainingStatus.traffic.training && (
            <div className="space-y-2">
              <Progress value={trainingStatus.traffic.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Training... {Math.round(trainingStatus.traffic.progress)}% 
                {trainingStatus.traffic.loss > 0 && ` • Loss: ${trainingStatus.traffic.loss.toFixed(4)}`}
              </p>
            </div>
          )}

          <Button
            onClick={() => trainModel("traffic")}
            disabled={trainingStatus.traffic.training || aiModel.getIsTraining()}
            className="w-full"
            variant={trainingStatus.traffic.trained ? "outline" : "default"}
          >
            {trainingStatus.traffic.trained ? "Retrain Model" : "Train Traffic AI"}
          </Button>
        </div>

        {/* Energy Model */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="font-medium">Energy Prediction</span>
            </div>
            {trainingStatus.energy.trained && (
              <CheckCircle className="w-4 h-4 text-secondary" />
            )}
          </div>
          
          {trainingStatus.energy.training && (
            <div className="space-y-2">
              <Progress value={trainingStatus.energy.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Training... {Math.round(trainingStatus.energy.progress)}%
                {trainingStatus.energy.loss > 0 && ` • Loss: ${trainingStatus.energy.loss.toFixed(4)}`}
              </p>
            </div>
          )}

          <Button
            onClick={() => trainModel("energy")}
            disabled={trainingStatus.energy.training || aiModel.getIsTraining()}
            className="w-full"
            variant={trainingStatus.energy.trained ? "outline" : "default"}
          >
            {trainingStatus.energy.trained ? "Retrain Model" : "Train Energy AI"}
          </Button>
        </div>

        {/* Info */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Training Info:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Models train on 20 samples with 50 epochs</li>
                <li>Uses TensorFlow.js for in-browser training</li>
                <li>Lower loss = better predictions</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
