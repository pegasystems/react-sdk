export function getLocale(locale) {
  if (locale) return locale;
  return document.documentElement.lang;
}

export function getCurrentTimezone(timezone) {
  if (timezone) return timezone;
  // eslint-disable-next-line no-undef
  return PCore?.getLocaleUtils?.().getTimeZoneInUse?.();
}
