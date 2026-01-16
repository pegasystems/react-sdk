import { logout } from '@pega/auth/lib/sdk-auth-manager';

export default function InvalidPortal({ defaultPortal, portals, onSelect }) {
  const logOff = () => {
    logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  };

  return (
    <div className='portal-load-error'>
      <div>
        Default portal ( <span className='portal-name'>{defaultPortal}</span> ) for current operator is not compatible with SDK. <br />
        <br />
        Please select one of the portals available to the operator&apos;s access group:
      </div>
      <div className='portals-list'>
        {portals.map(portal => (
          <div key={portal} className='portal-list-item' onClick={() => onSelect(portal)}>
            {portal}
          </div>
        ))}
      </div>
      <button type='button' className='logout-btn' onClick={logOff}>
        Logout
      </button>
    </div>
  );
}
