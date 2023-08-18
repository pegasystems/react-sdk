
import i18n from "i18next";
/*
  setPageTile(pageHeading:string, serviceName:string)
  Sets page title to in following pattern
  <<pageHeading>> - <<serviceName>> - GOV.UK`
*/
export default function setPageTitle(){

    // In case where there may be multiple H1s on page (e.g. breifly may have pega part of page and confirmation screen shown together)
    // set up an interval to keep checking until we have only one H1, and then set the page title with the remaining H1
    // This assumes we follow the best practice to only display one h1 on the page, and simply works around the 'gap' when our main
    // page updates to hide/show components.
    if(document.getElementsByTagName('h1').length > 1){
      const setPageTitleInterval = setInterval(
        () => {
          if(document.getElementsByTagName('h1').length === 1){
            clearInterval(setPageTitleInterval);
            setPageTitle();
          }
        }, 500)
    }

    const pageHeading = i18n.t(document.getElementsByTagName('h1')[0]?.innerText);

    // Scope to fetch serviceName dynamically from here
    // TODO fetch serviceName dynamically
    const serviceName = i18n.t("CLAIM_CHILD_BENEFIT");

  if(pageHeading){
  document.title = `${pageHeading} - ${serviceName} - GOV.UK`
  } else {
  document.title = `${serviceName} - GOV.UK`;
  }
}
