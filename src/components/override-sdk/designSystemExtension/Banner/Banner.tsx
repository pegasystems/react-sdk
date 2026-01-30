import Grid2 from '@mui/material/Grid2';
import './Banner.css';

// AlertBanner is one of the few components that does NOT have getPConnect.
//  So, no need to extend PConnProps

interface BannerProps {
  // If any, enter additional props that only exist on this component
  a: any;
  b: any;
  banner: {
    variant: any;
    backgroundColor: any;
    title: any;
    message: any;
    backgroundImage: any;
    tintImage: any;
  };
  variant: any;
}

export default function Banner(props: BannerProps) {
  const { a, b, banner, variant } = props;
  const { title, message, backgroundImage } = banner;
  const variantMap = {
    'two-column': [6, 6],
    'narrow-wide': [4, 8],
    'wide-narrow': [8, 4]
  };

  // const GovUKPage = () => {
  //   return (
  //     <div className='govuk-template__body'>
  //       <header className='govuk-header ' role='banner' data-module='govuk-header'>
  //         <div className='govuk-header__container govuk-width-container'>
  //           <div className='govuk-header__logo'>
  //             <a href='/' className='govuk-header__link govuk-header__link--homepage'>
  //               <span className='govuk-header__logotype'>
  //                 <svg
  //                   aria-hidden='true'
  //                   focusable='false'
  //                   className='govuk-header__logotype-crown'
  //                   xmlns='http://www.w3.org/2000/svg'
  //                   viewBox='0 0 132 97'
  //                   height='30'
  //                   width='36'
  //                 >
  //                   <path
  //                     fill='currentColor'
  //                     fillRule='evenodd'
  //                     d='M25 30.2c3.5 1.5 7.7 3.2 11.7 5.1 4.1 1.9 8.2 3.8 12.5 5.7l4.1 1.9c4.4 2 8.9 4.1 13.6 6.2 4.7 2.1 9.5 4.2 14.2 6.3l4.1 1.9c4.4 2 8.9 4.1 13.6 6.2 4.7 2.1 9.5 4.2 14.2 6.3l3.3-3.3c-2.1-1.1-4.2-2.3-6.4-3.4-2.2-1.2-4.4-2.4-6.6-3.7-2.2-1.2-4.4-2.5-6.7-3.8l-3.3 3.3c2.1 1.1 4.2 2.3 6.4 3.4 2.2 1.2 4.4 2.4 6.6 3.7 2.2 1.2 4.4 2.5 6.7 3.8l3.3-3.3c-2.1-1.1-4.2-2.3-6.4-3.4-2.2-1.2-4.4-2.4-6.6-3.7-2.2-1.2-4.4-2.5-6.7-3.8l-3.3 3.3c2.1 1.1 4.2 2.3 6.4 3.4 2.2 1.2 4.4 2.4 6.6 3.7 2.2 1.2 4.4 2.5 6.7 3.8 2.3 1.3 4.6 2.6 6.9 3.9l-2.2 2.2c-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2l-2.2 2.2c1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2l-2.2 2.2c-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2l-2.2 2.2c1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2-2.9 2.9-5.8 5.8-8.7 8.7-2.9 2.9-5.8 5.8-8.7 8.7-2.9 2.9-5.8 5.8-8.7 8.7l-3.3-3.3c1.5-1.4 3-2.8 4.5-4.2 1.5-1.4 3-2.8 4.5-4.2 1.5-1.4 3-2.8 4.5-4.2 1.5-1.4 3-2.8 4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2l-3.3 3.3c1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5-4.2z M94.4 22.1c-2.1-1.1-4.2-2.3-6.4-3.4-2.2-1.2-4.4-2.4-6.6-3.7-2.2-1.2-4.4-2.5-6.7-3.8l-3.3 3.3c2.1 1.1 4.2 2.3 6.4 3.4 2.2 1.2 4.4 2.4 6.6 3.7 2.2 1.2 4.4 2.5 6.7 3.8l3.3-3.3z'
  //                   ></path>
  //                   <image
  //                     src='/assets/images/govuk-logotype-crown.png'
  //                     className='govuk-header__logotype-crown-fallback-image'
  //                     width='36'
  //                     height='32'
  //                   ></image>
  //                 </svg>
  //                 <span className='govuk-header__logotype-text'> GOV.UK </span>
  //               </span>
  //             </a>
  //           </div>
  //           <div className='govuk-header__content'>
  //             <button
  //               type='button'
  //               className='govuk-header__menu-button govuk-js-header-toggle'
  //               aria-controls='navigation'
  //               aria-label='Show or hide menu'
  //             >
  //               Menu
  //             </button>
  //             <nav>
  //               <ul id='navigation' className='govuk-header__navigation ' aria-label='Menu'>
  //                 <li className='govuk-header__navigation-item'>
  //                   <a className='govuk-header__link' href='#1'>
  //                     Departments
  //                   </a>
  //                 </li>
  //                 <li className='govuk-header__navigation-item'>
  //                   <a className='govuk-header__link' href='#2'>
  //                     Guidance and regulation
  //                   </a>
  //                 </li>
  //                 <li className='govuk-header__navigation-item'>
  //                   <a className='govuk-header__link' href='#3'>
  //                     News and communications
  //                   </a>
  //                 </li>
  //               </ul>
  //             </nav>
  //           </div>
  //         </div>
  //       </header>

  //       <div className='govuk-width-container'>
  //         <main className='govuk-main-wrapper ' id='main-content' role='main'>
  //           <div className='govuk-grid-row'>
  //             <div className='govuk-grid-column-two-thirds'>
  //               <h1 className='govuk-heading-xl'>The best place to find government services and information</h1>
  //             </div>
  //           </div>
  //           <div className='govuk-grid-row'>
  //             <div className='govuk-grid-column-two-thirds'>
  //               <form action='/search' method='get' role='search'>
  //                 <div className='govuk-form-group'>
  //                   <label className='govuk-label' htmlFor='search'>
  //                     Search
  //                   </label>
  //                   <div className='govuk-input__wrapper'>
  //                     <input className='govuk-input' id='search' name='q' type='search' title='Search' />
  //                     <button className='govuk-button' data-module='govuk-button'>
  //                       <svg
  //                         className='govuk-button__icon'
  //                         xmlns='http://www.w3.org/2000/svg'
  //                         width='24'
  //                         height='24'
  //                         viewBox='0 0 24 24'
  //                         aria-hidden='true'
  //                         focusable='false'
  //                       >
  //                         <path
  //                           d='M13.7 12.3c.6.6 1.4 1 2.3 1s1.7-.4 2.3-1c.6-.6 1-1.4 1-2.3s-.4-1.7-1-2.3c-.6-.6-1.4-1-2.3-1s-1.7.4-2.3 1c-.6.6-1 1.4-1 2.3s.4 1.7 1 2.3zM19.8 18.4l-4.2-4.2c-.5-.5-1.2-.8-2.1-.8h-.1c-1.1 0-2.2.4-3.1 1.2-1.8 1.8-1.8 4.7 0 6.5 1.8 1.8 4.7 1.8 6.5 0 .9-.9 1.2-2 1.2-3.1v-.1c0-.8-.3-1.6-.8-2.1l4.2 4.2c.5.5 1.3.5 1.8 0 .5-.5.5-1.3 0-1.8z'
  //                           fill='currentColor'
  //                         ></path>
  //                       </svg>
  //                     </button>
  //                   </div>
  //                 </div>
  //               </form>
  //             </div>
  //           </div>
  //         </main>
  //       </div>
  //     </div>
  //   );
  // };

  const GovUKPage = () => {
    return (
      <div className='govuk-template__body'>
        <header className='govuk-header ' role='banner' data-module='govuk-header' style={{ display: 'none' }}>
          <div className='govuk-header__container govuk-width-container'>
            <div className='govuk-header__logo'>
              <a href='/' className='govuk-header__link govuk-header__link--homepage'>
                <span className='govuk-header__logotype'>
                  {/* Crown Logo SVG - Image tag removed to fix 404 error */}
                  <svg
                    aria-hidden='true'
                    focusable='false'
                    className='govuk-header__logotype-crown'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 132 97'
                    height='30'
                    width='36'
                  >
                    <path
                      fill='currentColor'
                      fillRule='evenodd'
                      d='M25 30.2c3.5 1.5 7.7 3.2 11.7 5.1 4.1 1.9 8.2 3.8 12.5 5.7l4.1 1.9c4.4 2 8.9 4.1 13.6 6.2 4.7 2.1 9.5 4.2 14.2 6.3l4.1 1.9c4.4 2 8.9 4.1 13.6 6.2 4.7 2.1 9.5 4.2 14.2 6.3l3.3-3.3c-2.1-1.1-4.2-2.3-6.4-3.4-2.2-1.2-4.4-2.4-6.6-3.7-2.2-1.2-4.4-2.5-6.7-3.8l-3.3 3.3c2.1 1.1 4.2 2.3 6.4 3.4 2.2 1.2 4.4 2.4 6.6 3.7 2.2 1.2 4.4 2.5 6.7 3.8l3.3-3.3c-2.1-1.1-4.2-2.3-6.4-3.4-2.2-1.2-4.4-2.4-6.6-3.7-2.2-1.2-4.4-2.5-6.7-3.8l-3.3 3.3c2.1 1.1 4.2 2.3 6.4 3.4 2.2 1.2 4.4 2.4 6.6 3.7 2.2 1.2 4.4 2.5 6.7 3.8 2.3 1.3 4.6 2.6 6.9 3.9l-2.2 2.2c-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2l-2.2 2.2c1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2l-2.2 2.2c-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2l-2.2 2.2c1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2-2.9 2.9-5.8 5.8-8.7 8.7-2.9 2.9-5.8 5.8-8.7 8.7-2.9 2.9-5.8 5.8-8.7 8.7l-3.3-3.3c1.5-1.4 3-2.8 4.5-4.2 1.5-1.4 3-2.8 4.5-4.2 1.5-1.4 3-2.8 4.5-4.2 1.5-1.4 3-2.8 4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2-1.5-1.4-3-2.8-4.5-4.2l-3.3 3.3c1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5 4.2 1.5 1.4 3 2.8 4.5-4.2z M94.4 22.1c-2.1-1.1-4.2-2.3-6.4-3.4-2.2-1.2-4.4-2.4-6.6-3.7-2.2-1.2-4.4-2.5-6.7-3.8l-3.3 3.3c2.1 1.1 4.2 2.3 6.4 3.4 2.2 1.2 4.4 2.4 6.6 3.7 2.2 1.2 4.4 2.5 6.7 3.8l3.3-3.3z'
                    ></path>
                  </svg>
                  <span className='govuk-header__logotype-text'> GOV.UK </span>
                </span>
              </a>
            </div>
            <div className='govuk-header__content'>
              <button
                type='button'
                className='govuk-header__menu-button govuk-js-header-toggle'
                aria-controls='navigation'
                aria-label='Show or hide menu'
              >
                Menu
              </button>
              <nav>
                <ul id='navigation' className='govuk-header__navigation ' aria-label='Menu'>
                  <li className='govuk-header__navigation-item'>
                    <a className='govuk-header__link' href='#1'>
                      Departments
                    </a>
                  </li>
                  <li className='govuk-header__navigation-item'>
                    <a className='govuk-header__link' href='#2'>
                      Guidance and regulation
                    </a>
                  </li>
                  <li className='govuk-header__navigation-item'>
                    <a className='govuk-header__link' href='#3'>
                      News and communications
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <div className='govuk-width-container'>
          <main className='govuk-main-wrapper ' id='main-content' role='main'>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <h1 className='govuk-heading-xl'>The best place to find Mobile services and information</h1>
              </div>
            </div>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                <form action='/search' method='get' role='search'>
                  <div className='govuk-form-group'>
                    <label className='govuk-label' htmlFor='search'>
                      Search
                    </label>
                    <div className='govuk-input__wrapper'>
                      <input className='govuk-input' id='search' name='q' type='search' title='Search' />
                      <button className='govuk-button' data-module='govuk-button'>
                        {/* <svg
                          className='govuk-button__icon'
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                          focusable='false'
                        >
                          <path
                            d='M13.7 12.3c.6.6 1.4 1 2.3 1s1.7-.4 2.3-1c.6-.6 1-1.4 1-2.3s-.4-1.7-1-2.3c-.6-.6-1.4-1-2.3-1s-1.7.4-2.3 1c-.6.6-1 1.4-1 2.3s.4 1.7 1 2.3zM19.8 18.4l-4.2-4.2c-.5-.5-1.2-.8-2.1-.8h-.1c-1.1 0-2.2.4-3.1 1.2-1.8 1.8-1.8 4.7 0 6.5 1.8 1.8 4.7 1.8 6.5 0 .9-.9 1.2-2 1.2-3.1v-.1c0-.8-.3-1.6-.8-2.1l4.2 4.2c.5.5 1.3.5 1.8 0 .5-.5.5-1.3 0-1.8z'
                            fill='currentColor'
                          ></path>
                        </svg> */}
                        <svg
                          className='gem-c-search__icon'
                          width='27'
                          height='27'
                          viewBox='0 0 27 27'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                          focusable='false'
                        >
                          <circle cx='12.0161' cy='11.0161' r='8.51613' stroke='currentColor' stroke-width='3'></circle>
                          <line x1='17.8668' y1='17.3587' x2='26.4475' y2='25.9393' stroke='currentColor' stroke-width='3'></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div>{GovUKPage()}</div>
      {/* <div className='background-image-style' style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className='background-style content'>
          <div>
            <h1 className='title'>{title}</h1>
            <p className='message'>{message}</p>
          </div>
        </div>
      </div> */}
      <Grid2 container size={12} className='banner-layout' style={{ maxWidth: '960px', margin: '0 auto' }} spacing={1}>
        {/* <Grid2
          size={{ xs: variantMap[variant][0] }}
          style={{ padding: '1rem', backgroundColor: 'var(--app-form-bg-color)', borderRadius: '16px', height: 'fit-content' }}
        > */}
        {a}
        {/* </Grid2> */}
        {/* <Grid2 size={{ xs: variantMap[variant][1] }} style={{ padding: '0rem 1rem' }}>
          {b}
        </Grid2> */}
      </Grid2>
    </div>
  );
}
