import { sdkSetAuthHeader, sdkSetCustomTokenParamsCB } from '@pega/auth/lib/sdk-auth-manager';

export const shoppingOptions = [
  {
    play: 'Triple Play',
    level: 'Basic',
    channels: '100+',
    channels_full: '100+ (Basic +)',
    banner: 'Value package',
    price: '99.00',
    internetSpeed: '100 Mbps',
    calling: ''
  },
  {
    play: 'Triple Play',
    level: 'Silver',
    channels: '125+',
    channels_full: '125+ (Deluxe)',
    banner: 'Most popular',
    price: '120.00',
    internetSpeed: '300 Mbps',
    calling: ''
  },
  {
    play: 'Triple Play',
    level: 'Gold',
    channels: '175+',
    channels_full: '175+ (Premium)',
    banner: 'All the channels you want',
    price: '150.00',
    internetSpeed: '1 Gbps',
    calling: ' & International'
  }
];

export function initializeAuthentication(sdkConfigAuth) {
  if ((sdkConfigAuth.mashupGrantType === 'none' || !sdkConfigAuth.mashupClientId) && sdkConfigAuth.customAuthType === 'Basic') {
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if ((sdkConfigAuth.mashupGrantType === 'none' || !sdkConfigAuth.mashupClientId) && sdkConfigAuth.customAuthType === 'BasicTO') {
    const now = new Date();
    const expTime = new Date(now.getTime() + 5 * 60 * 1000);
    let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
    const regex = /[-:]/g;
    sISOTime = sISOTime.replace(regex, '');
    // Service package to use custom auth with Basic
    const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
    sdkSetAuthHeader(`Basic ${sB64}`);
  }

  if (sdkConfigAuth.mashupGrantType === 'customBearer' && sdkConfigAuth.customAuthType === 'CustomIdentifier') {
    // Use custom bearer with specific custom parameter to set the desired operator via
    //  a userIdentifier property.  (Caution: highly insecure...being used for simple demonstration)
    sdkSetCustomTokenParamsCB(() => {
      return { userIdentifier: sdkConfigAuth.mashupUserIdentifier };
    });
  }
}
