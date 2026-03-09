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
export function getImageSrc(name: string): string {
  // Absolute path — icons are bundled locally by webpack into /constellation/icons/
  return `/constellation/icons/${name}.svg`;
}

export function getIconPath(): string {
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
 * Fetch work list data from a data page (mirrors Angular fetchMyWorkList).
 */
export function fetchMyWorkList(
  datapage: string,
  fields: Record<string, string>,
  numberOfRecords: number,
  includeTotalCount: boolean,
  context: string
) {
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

/** Shared palette colors for card/icon backgrounds (used by ListView + GalleryGrid). */
export const bgColors = ['#ede9fe', '#fce7f3', '#e0f2fe', '#ffedd5', '#f3e8ff', '#d1fae5'];
export const colorFilters = [
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(250deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(320deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(190deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(25deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(120deg) saturate(500%)',
  'brightness(0) saturate(100%) invert(20%) sepia(80%) hue-rotate(90deg) saturate(500%)'
];
