import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Czech plural forms: 1 tým, 2–4 týmy, 0 or 5+ týmů
export function pluralCs(count: number, one: string, few: string, many: string) {
  const form = count === 1 ? one : count >= 2 && count <= 4 ? few : many
  return `${count} ${form}`
}
