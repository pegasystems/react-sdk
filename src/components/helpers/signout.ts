import {logout} from '@pega/react-sdk-components/lib/components/helpers/authManager';

const signOutAndRedirect = () => {
  logout().then(()=> {
    window.location.href = 'https://www.gov.uk/government/organisations/hm-revenue-customs';
  })
}

export default signOutAndRedirect;
