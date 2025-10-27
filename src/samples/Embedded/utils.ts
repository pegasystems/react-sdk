import { sdkSetAuthHeader, sdkSetCustomTokenParamsCB } from '@pega/auth/lib/sdk-auth-manager';

export const shoppingOptions = [
  {
    name: 'Oceonix 25',
    imageSrc: './assets/img/WhitePhone.png',
    saveAmount: 'Save $150',
    monthlyPrice: 'Starting at $18.05/mo',
    tenure: 'for 36 months',
    retailPrice: 'Retail price: $800.00',
    level: 'Basic'
  },
  {
    name: 'Oceonix 25 Max',
    imageSrc: './assets/img/SilverPhone.png',
    saveAmount: 'Save $200',
    monthlyPrice: 'Starting at $22.22/mo',
    tenure: 'for 36 months',
    retailPrice: 'Retail price: $1,000.00',
    level: 'Silver'
  },
  {
    name: 'Oceonix 25 Ultra',
    imageSrc: './assets/img/GoldPhone.png',
    saveAmount: 'Save $250',
    monthlyPrice: 'Starting at $26.38/mo',
    tenure: 'for 36 months',
    retailPrice: 'Retail price: $1,200.00',
    level: 'Gold'
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
