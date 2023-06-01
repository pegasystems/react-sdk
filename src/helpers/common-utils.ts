// eslint-disable-next-line import/prefer-default-export
export function isEmptyObject(obj: Object): Boolean {
  return Object.keys(obj).length === 0;
}

export function processQueryParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const portal = urlParams.get("portal");
  const locale = urlParams.get("locale");

  if (portal) {
    sessionStorage.setItem("rsdk_portalName", portal);
  }
  if(locale){
    sessionStorage.setItem('rsdk_locale', locale);
  }
}
