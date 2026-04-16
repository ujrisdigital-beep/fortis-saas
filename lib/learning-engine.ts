"use client";

export type AnalysisEntry = {
  id: number;
  tool: string;
  input: unknown;
  output: unknown;
  rating: number;
  feedback?: string;
  timestamp: string;
  improved: boolean;
};

export type LearningStats = {
  total: number;
  averageRating: number;
  highRated: number;
  needsImprovement: boolean;
};

export type AdminNotification = {
  id: number;
  tool: string;
  message: string;
  timestamp: string;
  read: boolean;
};

const DB_NAME = "FortisLearning";
const STORE_NAME = "analyses";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by_tool", "tool", { unique: false });
        store.createIndex("by_timestamp", "timestamp", { unique: false });
      }
    };
  });
}

function storeGet<T>(store: IDBObjectStore, key: IDBValidKey): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result as T);
  });
}

function storeGetAll<T>(store: IDBObjectStore): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result as T[]);
  });
}

function indexCount(index: IDBIndex, key: IDBValidKey | IDBKeyRange): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = index.count(key);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

function indexGetAll<T>(index: IDBIndex, query?: IDBValidKey | IDBKeyRange): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const req = query ? index.getAll(query) : index.getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result as T[]);
  });
}

function storeAdd(store: IDBObjectStore, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = store.add(value);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
  });
}

function notifyAdmin(tool: string): void {
  try {
    const raw = localStorage.getItem("ujris_notifications") ?? "[]";
    const notifications: AdminNotification[] = JSON.parse(raw);
    notifications.push({
      id: Date.now(),
      tool,
      message: `${tool} has 100+ analyses. Ready for prompt improvement!`,
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem("ujris_notifications", JSON.stringify(notifications));
  } catch {
    // localStorage unavailable — skip
  }
}

export async function saveAnalysis(
  tool: string,
  input: unknown,
  output: unknown,
  rating: number,
  feedback?: string,
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await storeAdd(store, {
    id: Date.now(),
    tool,
    input,
    output,
    rating,
    feedback: feedback ?? "",
    timestamp: new Date().toISOString(),
    improved: false,
  });

  const count = await getAnalysisCount(tool);
  if (count >= 100) {
    notifyAdmin(tool);
  }
}

export async function getAnalysisCount(tool: string): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("by_tool");
  return indexCount(index, tool);
}

export async function getHighRatedAnalyses(
  tool: string,
  minRating = 4,
): Promise<AnalysisEntry[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("by_tool");
  const all = await indexGetAll<AnalysisEntry>(index, tool);
  return all.filter((a) => a.rating >= minRating);
}

export async function getStats(tool?: string): Promise<LearningStats> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const all = await storeGetAll<AnalysisEntry>(store);

  const filtered = tool ? all.filter((a) => a.tool === tool) : all;
  const avgRating =
    filtered.reduce((sum, a) => sum + (a.rating ?? 0), 0) / (filtered.length || 1);

  return {
    total: filtered.length,
    averageRating: Math.round(avgRating * 10) / 10,
    highRated: filtered.filter((a) => a.rating >= 4).length,
    needsImprovement: filtered.length >= 100,
  };
}

export function getAdminNotifications(): AdminNotification[] {
  try {
    const raw = localStorage.getItem("ujris_notifications") ?? "[]";
    return JSON.parse(raw) as AdminNotification[];
  } catch {
    return [];
  }
}

export function markNotificationsRead(): void {
  try {
    const notifications = getAdminNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem("ujris_notifications", JSON.stringify(notifications));
  } catch {
    // ignore
  }
}

// Convenience class wrapper (used in admin diagnostics)
export class FortisLearningEngine {
  async saveAnalysis(tool: string, input: unknown, output: unknown, rating: number, feedback?: string) {
    return saveAnalysis(tool, input, output, rating, feedback);
  }
  async getAnalysisCount(tool: string) {
    return getAnalysisCount(tool);
  }
  async getHighRatedAnalyses(tool: string, minRating = 4) {
    return getHighRatedAnalyses(tool, minRating);
  }
  async getStats(tool?: string) {
    return getStats(tool);
  }
}
