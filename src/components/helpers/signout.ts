import {logout} from '@pega/react-sdk-components/lib/components/helpers/authManager';

const signOutAndRedirect = () => {
  sessionStorage.removeItem('rsdk_locale');
  logout().then(()=> {
    window.location.href = 'https://www.gov.uk/government/organisations/hm-revenue-customs';
  })
}

export default signOutAndRedirect;
