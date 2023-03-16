export function getLocale(locale) {
  // use locale if specified
  if (locale) return locale;
  // otherwise, use operator locale if it's defined
  if (window.PCore.getEnvironmentInfo().getUseLocale()) return window.PCore.getEnvironmentInfo().getUseLocale();
  // fallback
  return Intl.DateTimeFormat().resolvedOptions().locale;
}

export function getCurrentTimezone(timezone) {
  if (timezone) return timezone;
  // eslint-disable-next-line no-undef
  return PCore?.getLocaleUtils?.().getTimeZoneInUse?.();
}
