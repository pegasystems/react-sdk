/**
 * Utility to build the SDK static content URL for icon/image assets.
 * Mirrors the Angular Utils.getSDKStaticContentUrl / getImageSrc pattern.
 */
export function getSDKStaticContentUrl(): string {
  // PCore.getAssetLoader().getStaticServerUrl() returns the base URL for static assets
  try {
    return `${PCore.getAssetLoader().getStaticServerUrl()}constellation/`;
  } catch {
    return 'constellation/';
  }
}

/**
 * Get image src URL for a local icon.
 * Uses a relative path so icons are served from the local dev server
 * (webpack copies assets/icons/* to constellation/icons/).
 */
export function getImageSrc(name: string, _staticUrl?: string): string {
  // Absolute path — icons are bundled locally by webpack into /constellation/icons/
  return `/constellation/icons/${name}.svg`;
}

export function getIconPath(_staticUrl?: string): string {
  return '/constellation/icons/';
}

/**
 * Get user initials from a full name string.
 */
export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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

/**
 * Fetch work list data from a data page (mirrors Angular fetchMyWorkList).
 */
export function fetchMyWorkList(datapage: string, fields: Record<string, string>, numberOfRecords: number, includeTotalCount: boolean, context: string) {
  return PCore.getDataPageUtils()
    .getDataAsync(
      datapage,
      context,
      {},
      { pageNumber: 1, pageSize: numberOfRecords },
      {
        select: Object.keys(fields).map(key => ({ field: PCore.getAnnotationUtils().getPropertyName(fields[key]) })),
        sortBy: [
          { field: 'pxUrgencyAssign', type: 'DESC' },
          { field: 'pxDeadlineTime', type: 'ASC' },
          { field: 'pxCreateDateTime', type: 'DESC' }
        ]
      },
      { invalidateCache: true, additionalApiParams: { includeTotalCount } }
    )
    .then((response: any) => {
      return {
        ...response,
        data: (Array.isArray(response?.data) ? response.data : []).map((row: any) =>
          Object.keys(fields).reduce(
            (obj, key) => {
              obj[key] = row[PCore.getAnnotationUtils().getPropertyName(fields[key])];
              return obj;
            },
            {} as Record<string, any>
          )
        )
      };
    });
}

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
