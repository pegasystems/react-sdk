/**
 * ListView-specific helpers — co-located with the ListView component.
 */

/**
 * Maps activity types to icons (for Account History list).
 */
export const CASE_TYPE_TO_ACTIVITY_MAP: Record<string, string> = {
  'Plan Upgrade': 'Plan Upgrade',
  Payment: 'Make Payment',
  AddOnPurchase: 'Add-On Services',
  'New Statement': 'New Service',
  ProfileUpdated: 'Get Help',
  'Product Demo': 'Purchase Phone'
};

export function getActivityIcon(activityType: string): string {
  switch (activityType) {
    case 'Plan Upgrade':
      return 'trending-up';
    case 'Make Payment':
      return 'wallet';
    case 'Add-On Services':
      return 'monitor';
    case 'New Service':
      return 'shopping-cart';
    case 'Get Help':
      return 'headphones';
    case 'Purchase Phone':
      return 'smartphone';
    default:
      return '';
  }
}

/**
 * Human-readable time-since string.
 */
export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m ago`;
  return `${Math.floor(seconds)}s ago`;
}
