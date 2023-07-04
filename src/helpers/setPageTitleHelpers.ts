
/*
  setPageTile(pageHeading:string, serviceName:string)
  Sets page title to in following pattern
  <<pageHeading>> - <<serviceName>> - GOV.UK`
*/
export default function setPageTitle(){

  const pageHeading = document.getElementsByTagName('h1')[0]?.innerText

  // Scope to fetch serviceName dynamically from here
  const serviceName = 'Child benefit claim';

  if(pageHeading){
  document.title = `${pageHeading} - ${serviceName} - GOV.UK`
  } else {
  document.title = `${serviceName} - GOV.UK`;
  }
}
