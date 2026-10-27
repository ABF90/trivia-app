import type { Category, CategoryId } from "@/features/game/types";

export const CATEGORIES: readonly Category[] = [
  { id: "legends", label: "أساطير الأزرق" },
  { id: "worldcup", label: "كأس العالم" },
  { id: "gulf", label: "كأس الخليج" },
  { id: "league", label: "الدوري والديربي" },
  { id: "olympics", label: "الأولمبياد" },
];

export const ALL_CATEGORIES_LABEL = "كل الأقسام";

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return byId.get(id)!;
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && byId.has(value as CategoryId);
}
