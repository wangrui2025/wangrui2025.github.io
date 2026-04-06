import { execSync } from 'child_process';
import { DEFAULT_LAST_UPDATED } from './constants';

/**
 * Get the last updated date from git history
 * Falls back to DEFAULT_LAST_UPDATED if git command fails
 */
export function getLastUpdated(fallbackDate: string = DEFAULT_LAST_UPDATED): string {
  try {
    const result = execSync('git log -1 --format="%cs"', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();
    return result || fallbackDate;
  } catch {
    return fallbackDate;
  }
}
