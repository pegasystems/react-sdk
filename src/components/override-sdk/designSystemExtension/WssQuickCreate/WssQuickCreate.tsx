import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './WssQuickCreate.css';

// WssQuickCreate is one of the few components that does NOT have getPConnect.
//  So, no need to extend PConnProps
interface WssQuickCreateProps {
  // If any, enter additional props that only exist on this component
  heading: string;
  actions?: any[];
}

const useStyles = makeStyles(theme => ({
  quickLinkList: {
    backgroundColor: theme.palette.mode === 'dark' ? 'var(--app-background-color)' : 'var(--link-button-color)',
    color: 'var(--app-text-color)',
    borderRadius: '16px',
    border: '1px solid var(--app-primary-color)'
  }
}));

export default function WssQuickCreate(props: WssQuickCreateProps) {
  const { heading, actions } = props;
  const classes = useStyles();
  const ArrowIcon = () => (
    <svg
      className='govuk-popular-link__icon-svg'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='24'
      height='24'
      aria-hidden='true'
      focusable='false'
    >
      <path d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z' fill='currentColor' />
    </svg>
  );
  return (
    <div>
      <h1 id='quick-links-heading' className='quick-links-heading'>
        Popular on MediaCo
      </h1>
      {/* <ul id='quick-links' className='quick-link-ul-list'>
        {actions &&
          actions.map(element => {
            return (
              <li className={classes.quickLinkList} key={element.label}>
                <Button className='quick-link-button' onClick={element.onClick}>
                  <span className='quick-link-button-span'>
                    {element.icon && <img className='quick-link-icon' src={element.icon} />}
                    <span>{element.label}</span>
                  </span>
                </Button>
              </li>
            );
          })}
      </ul> */}
      <div className='govuk-width-container'>
        <div className='govuk-grid-row'>
          {actions?.map((link, index) => (
            <div key={index} className='govuk-grid-column-one-third' onClick={link.onClick}>
              <div className='govuk-popular-link'>
                <div className='govuk-popular-link__circle'>
                  <ArrowIcon />
                </div>
                <a href={link.href} className='govuk-link govuk-font-weight-bold govuk-popular-link__link'>
                  {link.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
