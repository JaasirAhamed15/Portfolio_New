import fs from "fs/promises";
import path from "path";
import { PortfolioData, DEFAULT_SECTIONS_CONFIG } from "./portfolio-types";

export * from "./portfolio-types";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio-data.json");

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed: PortfolioData = JSON.parse(raw);

    // Ensure sectionsConfig exists and defaults are merged
    if (!parsed.sectionsConfig || !Array.isArray(parsed.sectionsConfig)) {
      parsed.sectionsConfig = DEFAULT_SECTIONS_CONFIG;
    } else {
      // Check if any default section is missing from sectionsConfig and add it
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
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    throw error;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    throw error;
  }
}
