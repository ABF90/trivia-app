import type { Category, CategoryId, Localized } from "@/features/game/types";

export const CATEGORIES: readonly Category[] = [
  { id: "sports", label: { ar: "رياضة", en: "Sports" } },
  { id: "animals", label: { ar: "حيوانات", en: "Animals" } },
  { id: "history", label: { ar: "تاريخ", en: "History" } },
  { id: "legends", label: { ar: "أساطير الأزرق", en: "Kuwait legends" } },
  { id: "worldcup", label: { ar: "كأس العالم", en: "World Cup" } },
  { id: "gulf", label: { ar: "كأس الخليج", en: "Gulf Cup" } },
  { id: "league", label: { ar: "الدوري والديربي", en: "Kuwaiti league" } },
  { id: "olympics", label: { ar: "الأولمبياد", en: "Olympics" } },
];

/** Questions the AI writes; never offered as a pickable category. */
export const AI_CATEGORY: Category = { id: "ai", label: { ar: "ذكاء اصطناعي", en: "AI" } };

/** The most categories a player can combine in one round. */
export const MAX_CATEGORIES = 3;

const byId = new Map([...CATEGORIES, AI_CATEGORY].map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return byId.get(id)!;
}

/** A category the player can pick (excludes the AI one). */
export function isCategoryId(value: unknown): value is CategoryId {
  return isAnyCategoryId(value) && value !== AI_CATEGORY.id;
}

/** Any category a question can carry, including AI-written ones. */
export function isAnyCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && byId.has(value as CategoryId);
}

/** Parses "sports,history" from a route param, keeping valid IDs only (max 3, no duplicates). */
export function parseCategories(value: string | undefined): CategoryId[] {
  if (!value) return [];
  return [...new Set(value.split(",").filter(isCategoryId))].slice(0, MAX_CATEGORIES);
}

export function categoryLabels(ids: readonly CategoryId[]): Localized[] {
  return ids.map((id) => getCategory(id).label);
}
