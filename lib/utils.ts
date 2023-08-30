import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function JSONLToUploadable(JSONL: string): File {
  const blob = new Blob([JSONL], { type: 'application/jsonl' })
  return new File([blob], "sample.jsonl", { type: 'application/jsonl', lastModified: new Date().getTime() })
}

export const roundNumber = (number: number, decimalPlaces: number) => Math.round(number * 10 ** decimalPlaces) / 10 ** decimalPlaces

export const apiKeyRegex = /^sk-[a-zA-Z0-9]{48}$/