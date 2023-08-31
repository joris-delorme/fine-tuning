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

// By ChatGPT-4 😎
export function bitsToMBorKB(bits: number): string {
  // Convert bits to Megabytes (MB)
  const MB = bits / 8 / (10**6);

  // If the number is smaller than 1 MB, convert to Kilobytes (KB)
  if (MB < 1) {
      const KB = bits / 8 / 1000; // Convert bits to KB
      return `${KB.toFixed(2)} KB`;
  } else {
      return `${MB.toFixed(2)} MB`;
  }
}

// By ChatGPT-4 😎
export function unixTimestampToDate(unixTimestamp: number) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const date = new Date(unixTimestamp * 1000);  // Convert Unix timestamp to milliseconds

  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${monthName} ${String(day).padStart(2, '0')} ${year}`;
}