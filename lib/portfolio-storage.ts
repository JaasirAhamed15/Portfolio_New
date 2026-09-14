import fs from "fs/promises";
import path from "path";
import { PortfolioData, DEFAULT_SECTIONS_CONFIG } from "./portfolio-types";
import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

export * from "./portfolio-types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio-data.json");
const REDIS_PORTFOLIO_KEY = "portfolio_data";

// Singleton client to avoid reconnecting on every serverless invocation
let ioRedisClient: IORedis | null = null;
let upstashClient: UpstashRedis | null = null;

const getRedisStorage = () => {
  const redisUrl =
    process.env.REDIS_URL ||
    process.env.STORAGE_URL;

  const restUrl =
    process.env.STORAGE_REST_API_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;

  const restToken =
    process.env.STORAGE_REST_API_TOKEN ||
    process.env.STORAGE_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. If REST API credentials exist, prefer Upstash REST client
  if (restUrl && restToken) {
    if (!upstashClient) {
      upstashClient = new UpstashRedis({ url: restUrl, token: restToken });
    }
    return {
      type: "upstash" as const,
      get: async (k: string) => await upstashClient!.get<PortfolioData | string>(k),
      set: async (k: string, v: unknown) => { await upstashClient!.set(k, v); },
    };
  }

  // 2. If redis:// connection string exists, use ioredis
  if (redisUrl && redisUrl.startsWith("redis")) {
    if (!ioRedisClient) {
      ioRedisClient = new IORedis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    }
    return {
      type: "ioredis" as const,
      get: async (k: string) => {
        if (ioRedisClient!.status === "wait") await ioRedisClient!.connect();
        const res = await ioRedisClient!.get(k);
        return res ? (JSON.parse(res) as PortfolioData) : null;
      },
      set: async (k: string, v: unknown) => {
        if (ioRedisClient!.status === "wait") await ioRedisClient!.connect();
        await ioRedisClient!.set(k, JSON.stringify(v));
      },
    };
  }

  return null;
};

function normalizePortfolioData(parsed: PortfolioData): PortfolioData {
  if (!parsed.sectionsConfig || !Array.isArray(parsed.sectionsConfig)) {
    parsed.sectionsConfig = DEFAULT_SECTIONS_CONFIG;
  } else {
    for (const def of DEFAULT_SECTIONS_CONFIG) {
      if (!parsed.sectionsConfig.some((s) => s.id === def.id)) {
        parsed.sectionsConfig.push(def);
      }
    }
    parsed.sectionsConfig.sort((a, b) => a.order - b.order);
  }

  if (!parsed.customSections || !Array.isArray(parsed.customSections)) {
    parsed.customSections = [];
  }

  return parsed;
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const redis = getRedisStorage();

  // 1. Try fetching from Redis first
  if (redis) {
    try {
      const cached = await redis.get(REDIS_PORTFOLIO_KEY);
      if (cached) {
        const data: PortfolioData =
          typeof cached === "string" ? JSON.parse(cached) : cached;
        return normalizePortfolioData(data);
      }
    } catch (err) {
      console.warn("Redis read error, falling back to local file:", err);
    }
  }

  // 2. Fallback to local portfolio-data.json
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed: PortfolioData = JSON.parse(raw);
    const normalized = normalizePortfolioData(parsed);

    // If Redis is connected but empty, seed it with the default JSON file
    if (redis) {
      try {
        await redis.set(REDIS_PORTFOLIO_KEY, normalized);
      } catch (err) {
        console.warn("Could not seed Redis:", err);
      }
    }

    return normalized;
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    throw error;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  const redis = getRedisStorage();

  // 1. Save to Redis (Vercel Production)
  if (redis) {
    try {
      await redis.set(REDIS_PORTFOLIO_KEY, data);
    } catch (err) {
      console.error("Error saving to Redis:", err);
      throw err;
    }
  }

  // 2. Also save to local file system if running locally (non-read-only)
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // In read-only environments (like Vercel Lambda), writing to disk will fail
    // which is expected when Redis is handling the persistence.
    if (!redis) {
      console.error("Error saving portfolio data to file:", err);
      throw err;
    }
  }
}
