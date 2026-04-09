import fs from "fs";
import path from "path";
import type { PlaceData } from "./types";

export function getPlaceData(): PlaceData {
  const filePath = path.join(process.cwd(), "data", "place-data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as PlaceData;
}
