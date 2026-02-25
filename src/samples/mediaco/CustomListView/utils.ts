import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

export function getImageSrc(name, serverUrl) {
  let iconName = name.replace('pi-', '').replace('pi ', '').trim();
  if (iconName === 'line-chart') {
    iconName = 'chart-line';
  }

  return getIconPath(serverUrl).concat(iconName).concat('.svg');
}

export function getIconPath(serverUrl) {
  return serverUrl.concat('icons/');
}

export function getSDKStaticConentUrl() {
  const sdkConfigServer = SdkConfigAccess.getSdkConfigServer();

  // NOTE: Needs a trailing slash! So add one if not provided
  if (!sdkConfigServer.sdkContentServerUrl.endsWith('/')) {
    sdkConfigServer.sdkContentServerUrl = `${sdkConfigServer.sdkContentServerUrl}/`;
  }

  return `${sdkConfigServer.sdkContentServerUrl}constellation/`;
}

export function getIcon(activityType) {
  switch (activityType) {
    case 'Upgrade plan':
      return 'trending-up';
    case 'Make payment':
      return 'wallet';
    case 'Add Streaming':
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

export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + 'y ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + 'd ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + 'h ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + 'm ago';
  }
  return Math.floor(seconds) + 's ago';
}

export function modifyListData(data: any[], referenceDataPage: string) {
  if (referenceDataPage === 'D_AccountHistoryList') {
    const caseTypeToActivityMap = {
      'Plan Upgrade': 'Upgrade plan',
      Payment: 'Make payment',
      AddOnPurchase: 'New Service',
      'New Statement': 'New Service',
      ProfileUpdated: 'Get Help',
      'Product Demo': 'Purchase Phone',
      'Client Onboarding': 'Add Streaming',
      'Quarterly Review': 'New Service',
      'Sales Meeting': 'New Service'
    };
    return data.map(item => {
      const caseType = caseTypeToActivityMap[item.ActivityType];
      return {
        id: item.pyGUID,
        iconSrc: getImageSrc(getIcon(caseType), getSDKStaticConentUrl()),
        title: item.ActivityType,
        time: timeSince(new Date(item.pxUpdateDateTime || item.pxCreateDateTime)),
        description: item.Description
      };
    });
  } else if (referenceDataPage === 'D_TrendingItemsList') {
    return data.map(item => {
      return {
        id: item.ID,
        title: item.Title,
        time: null,
        description: item.Category,
        views: `${item.Views} views`,
        rating: item.Rating
      };
    });
  }
  return [];
}
