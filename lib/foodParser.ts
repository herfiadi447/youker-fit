import type { FoodItem, ParsedFoodItem } from "@/types";
import foodsData from "@/data/indonesian_foods.json";

const foods: FoodItem[] = foodsData as FoodItem[];

/**
 * Parse natural language food input into structured food items.
 * e.g. "nasi putih 1 piring, tahu goreng 2 potong, telur rebus 1"
 */
export function parseFoodInput(input: string): ParsedFoodItem[] {
  const items = input
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return items.map((item) => {
    const parsed = parseOneItem(item);
    const matchedFood = findFoodMatch(parsed.foodName);
    return {
      ...parsed,
      matchedFood: matchedFood || undefined,
    };
  });
}

function parseOneItem(raw: string): ParsedFoodItem {
  const cleaned = raw.toLowerCase().trim();

  // Try to extract quantity and unit from the string
  // Patterns like: "nasi putih 1 piring", "tahu goreng 2 potong", "telur 1"
  const quantityPattern =
    /(\d+(?:[.,]\d+)?)\s*(piring|potong|butir|buah|mangkok|gelas|bungkus|lembar|porsi|ekor|sendok|cup|slice|piece|bowl|serving)?/i;
  const match = cleaned.match(quantityPattern);

  let quantity = 1;
  let unit = "porsi";
  let foodName = cleaned;

  if (match) {
    quantity = parseFloat(match[1].replace(",", "."));
    if (match[2]) {
      unit = match[2];
    }
    // Remove quantity and unit from food name
    foodName = cleaned
      .replace(quantityPattern, "")
      .trim()
      .replace(/\s+/g, " ");
  }

  // Clean trailing/leading common words
  foodName = foodName.replace(/^(dan|and|with)\s+/i, "").trim();

  return { foodName, quantity, unit };
}

function findFoodMatch(searchName: string): FoodItem | null {
  const search = searchName.toLowerCase();

  // Exact name match
  const exactMatch = foods.find(
    (f) => f.name.toLowerCase() === search
  );
  if (exactMatch) return exactMatch;

  // Alias match
  const aliasMatch = foods.find((f) =>
    f.aliases.some((a) => a.toLowerCase() === search)
  );
  if (aliasMatch) return aliasMatch;

  // Partial match (food name contains search or vice versa)
  const partialMatch = foods.find(
    (f) =>
      f.name.toLowerCase().includes(search) ||
      search.includes(f.name.toLowerCase()) ||
      f.aliases.some(
        (a) =>
          a.toLowerCase().includes(search) ||
          search.includes(a.toLowerCase())
      )
  );
  if (partialMatch) return partialMatch;

  return null;
}
