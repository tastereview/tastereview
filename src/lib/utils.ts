import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Encode a table identifier for use in QR code URLs (base64url, no padding). */
export function encodeTableId(identifier: string): string {
  return btoa(identifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Decode a table identifier from a QR code URL param. */
export function decodeTableId(encoded: string): string {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  return atob(base64)
}
