import * as tf from "@tensorflow/tfjs";
import trafficData from "@/data/traffic.json";
import energyData from "@/data/energy.json";

export type ModelType = "traffic" | "energy";

interface TrainingProgress {
  epoch: number;
  loss: number;
  accuracy?: number;
}

class AIModelManager {
  private trafficModel: tf.LayersModel | null = null;
  private energyModel: tf.LayersModel | null = null;
  private isTraining = false;

  async trainTrafficModel(
    onProgress?: (progress: TrainingProgress) => void
  ): Promise<void> {
    this.isTraining = true;

    // Prepare training data
    const data = trafficData.trainingData;
    const inputs = data.map(d => [d.hour / 24, d.dayOfWeek / 7, d.weather]);
    const outputs = data.map(d => [d.congestion / 100]);

    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor2d(outputs);

    // Create model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [3], units: 16, activation: "relu" }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: "relu" }),
        tf.layers.dense({ units: 1, activation: "sigmoid" })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: "meanSquaredError",
      metrics: ["accuracy"]
    });

    // Train
    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 4,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (onProgress && logs) {
            onProgress({
              epoch: epoch + 1,
              loss: logs.loss as number,
              accuracy: logs.acc as number
            });
          }
        }
      }
    });

    this.trafficModel = model;
    this.isTraining = false;

    // Cleanup tensors
    xs.dispose();
    ys.dispose();
  }

  async trainEnergyModel(
    onProgress?: (progress: TrainingProgress) => void
  ): Promise<void> {
    this.isTraining = true;

    // Prepare training data
    const data = energyData.trainingData;
    const inputs = data.map(d => [d.hour / 24, d.temperature / 35, d.isWeekday]);
    const outputs = data.map(d => [d.demand / 12000]);

    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor2d(outputs);

    // Create model
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [3], units: 16, activation: "relu" }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: "relu" }),
        tf.layers.dense({ units: 1, activation: "sigmoid" })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: "meanSquaredError",
      metrics: ["accuracy"]
    });

    // Train
    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 4,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (onProgress && logs) {
            onProgress({
              epoch: epoch + 1,
              loss: logs.loss as number,
              accuracy: logs.acc as number
            });
          }
        }
      }
    });

    this.energyModel = model;
    this.isTraining = false;

    // Cleanup tensors
    xs.dispose();
    ys.dispose();
  }

  async predictTraffic(hour: number, dayOfWeek: number, weather: number): Promise<number> {
    if (!this.trafficModel) {
      throw new Error("Traffic model not trained yet");
    }

    const input = tf.tensor2d([[hour / 24, dayOfWeek / 7, weather]]);
    const prediction = this.trafficModel.predict(input) as tf.Tensor;
    const value = (await prediction.data())[0] * 100;

    input.dispose();
    prediction.dispose();

    return Math.round(value);
  }

  async predictEnergy(hour: number, temperature: number, isWeekday: number): Promise<number> {
    if (!this.energyModel) {
      throw new Error("Energy model not trained yet");
    }

    const input = tf.tensor2d([[hour / 24, temperature / 35, isWeekday]]);
    const prediction = this.energyModel.predict(input) as tf.Tensor;
    const value = (await prediction.data())[0] * 12000;

    input.dispose();
    prediction.dispose();

    return Math.round(value);
  }

  getRecommendations(type: ModelType, currentValue: number, predictedValue: number): string[] {
    const recommendations: string[] = [];

    if (type === "traffic") {
      const diff = predictedValue - currentValue;
      if (diff > 15) {
        recommendations.push("🚦 Activate smart traffic light optimization");
        recommendations.push("📱 Send congestion alerts to commuters");
        recommendations.push("🚌 Deploy additional public transport units");
      } else if (diff < -10) {
        recommendations.push("⚡ Reduce traffic light cycle times");
        recommendations.push("🅿️ Open express lanes for faster flow");
      }
      
      if (predictedValue > 80) {
        recommendations.push("🔄 Suggest alternative routes via mobile app");
        recommendations.push("💡 Adjust street lighting for better visibility");
      }
    } else if (type === "energy") {
      const diff = predictedValue - currentValue;
      if (diff > 1500) {
        recommendations.push("🔋 Activate grid storage reserves");
        recommendations.push("☀️ Maximize solar panel output");
        recommendations.push("❄️ Pre-cool buildings to reduce peak load");
      } else if (diff < -1000) {
        recommendations.push("💾 Store excess energy in batteries");
        recommendations.push("🏭 Schedule non-urgent industrial loads");
      }

      if (predictedValue > 9000) {
        recommendations.push("📉 Send energy conservation alerts");
        recommendations.push("🌡️ Adjust smart thermostat settings citywide");
      }
    }

    return recommendations;
  }

  isModelTrained(type: ModelType): boolean {
    return type === "traffic" ? this.trafficModel !== null : this.energyModel !== null;
  }

  getIsTraining(): boolean {
    return this.isTraining;
  }
}

export const aiModel = new AIModelManager();
