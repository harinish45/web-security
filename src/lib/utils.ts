import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityClass(severity: string): string {
  const map: Record<string, string> = {
    critical: 'severity-critical',
    high: 'severity-high',
    medium: 'severity-medium',
    low: 'severity-low',
    info: 'severity-info',
  };
  return map[severity.toLowerCase()] || 'severity-info';
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

// Base64 encode/decode
export function base64Encode(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return 'Invalid input for Base64 encoding';
  }
}

export function base64Decode(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return 'Invalid Base64 string';
  }
}

// URL encode/decode
export function urlEncode(str: string): string {
  return encodeURIComponent(str);
}

export function urlDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return 'Invalid URL encoded string';
  }
}

// Hex encode/decode
export function hexEncode(str: string): string {
  return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

export function hexDecode(str: string): string {
  try {
    return str.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || 'Invalid hex';
  } catch (e) {
    return 'Invalid hex string';
  }
}