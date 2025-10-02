// IndexedDB wrapper for storing simulation history and predictions
const DB_NAME = "SmartCityDB";
const DB_VERSION = 1;

export interface SimulationRecord {
  id?: number;
  timestamp: number;
  type: "traffic" | "energy";
  prediction: number;
  actual?: number;
  scenario?: string;
  metrics?: Record<string, any>;
}

class SmartCityDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains("simulations")) {
          const store = db.createObjectStore("simulations", { 
            keyPath: "id", 
            autoIncrement: true 
          });
          store.createIndex("type", "type", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async addSimulation(record: Omit<SimulationRecord, "id">): Promise<number> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["simulations"], "readwrite");
      const store = transaction.objectStore("simulations");
      const request = store.add(record);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getSimulations(type?: "traffic" | "energy", limit = 50): Promise<SimulationRecord[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["simulations"], "readonly");
      const store = transaction.objectStore("simulations");
      const request = type 
        ? store.index("type").getAll(type)
        : store.getAll();

      request.onsuccess = () => {
        const results = request.result as SimulationRecord[];
        resolve(results.slice(-limit).reverse());
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getRecentSimulations(hours = 24): Promise<SimulationRecord[]> {
    if (!this.db) await this.init();

    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["simulations"], "readonly");
      const store = transaction.objectStore("simulations");
      const index = store.index("timestamp");
      const range = IDBKeyRange.lowerBound(cutoffTime);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result as SimulationRecord[]);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSimulations(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["simulations"], "readwrite");
      const store = transaction.objectStore("simulations");
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new SmartCityDatabase();
