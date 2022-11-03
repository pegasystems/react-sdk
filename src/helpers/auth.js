class PegaAuth {

  constructor(ssKeyConfig) {
      this.ssKeyConfig = ssKeyConfig;
      this.bEncodeSI = false;
      this.reloadConfig();
  }

  reloadConfig() {
      const peConfig = window.sessionStorage.getItem(this.ssKeyConfig);
      let obj = {};
      if( peConfig ) {
          try {
              obj = JSON.parse(peConfig);
          } catch (e) {
              try {
                  obj = JSON.parse(window.atob(peConfig));
              } catch(e2) {
                  obj = {};
              }
          }
      }

      this.config = peConfig ? obj : null;
  }

  #updateConfig() {
      const sSI = JSON.stringify(this.config);
      window.sessionStorage.setItem(this.ssKeyConfig, this.bEncodeSI ? window.btoa(sSI) : sSI);
  }

  // For PKCE the authorize includes a code_challenge & code_challenge_method as well
  async #buildAuthorizeUrl(state) {
      const {clientId, redirectUri, authorizeUri, authService, sessionIndex, appAlias, useLocking,
          userIdentifier, password} = this.config;

      // Generate random string of 64 chars for verifier.  RFC 7636 says from 43-128 chars
      let buf = new Uint8Array(64);
      window.crypto.getRandomValues(buf);
      this.config.codeVerifier = this.#base64UrlSafeEncode(buf);
      // If sessionIndex exists then increment attempts count (we will stop sending session_index after two failures)
      if( sessionIndex ) {
        this.config.sessionIndexAttempts += 1;
      }
      // Persist codeVerifier in session storage so it survives the redirects that are to follow
      this.#updateConfig();

      if( !state ) {
          // Calc random state variable
          buf = new Uint8Array(32);
          window.crypto.getRandomValues(buf);
          state = this.#base64UrlSafeEncode(buf);
      }

      // Trim alias to include just the real alias piece
      const addtlScope = appAlias ? `+app.alias.${appAlias.replace(/^app\//, '')}` : "";

      // Add explicit creds if specified to try to avoid login popup
      const moreAuthArgs =
          (authService ? `&authentication_service=${encodeURIComponent(authService)}` : "") +
          (sessionIndex && this.config.sessionIndexAttempts < 3 ? `&session_index=${sessionIndex}` : "") +
          (useLocking ? `&enable_psyncId=true` : '') +
          (userIdentifier ? `&UserIdentifier=${encodeURIComponent(userIdentifier)}` : '') +
          (userIdentifier && password ? `&Password=${encodeURIComponent(window.atob(password))}` : '');

      return this.#getCodeChallenge(this.config.codeVerifier).then( cc => {
        // Now includes new enable_psyncId=true and session_index params
        return `${authorizeUri}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=openid+email+profile${addtlScope}&state=${state}&code_challenge=${cc}&code_challenge_method=S256${moreAuthArgs}`;
      });
  }

  async login() {
      const fnGetRedirectUriOrigin = () => {
          const redirectUri = this.config.redirectUri;
          const nRootOffset = redirectUri.indexOf("//");
          const nFirstPathOffset = nRootOffset !== -1 ? redirectUri.indexOf("/",nRootOffset+2) : -1;
          return nFirstPathOffset !== -1 ? redirectUri.substring(0,nFirstPathOffset) : redirectUri;
      };

      const redirectOrigin = fnGetRedirectUriOrigin();
      // eslint-disable-next-line no-restricted-globals
      const state = window.btoa(location.origin);

      return new Promise( (resolve, reject) => {

          this.#buildAuthorizeUrl(state).then((url) => {
              let myWindow = null; // popup or iframe
              let elIframe = null;
              let elCloseBtn = null
              const iframeTimeout = this.config.silentTimeout !== undefined ? this.config.silentTimeout : 5000;
              let bWinIframe = iframeTimeout > 0 && ((!!this.config.userIdentifier && !!this.config.password) || this.config.iframeLoginUI || this.config.authService !== "pega");
              let tmrAuthComplete = null;
              let checkWindowClosed = null;
              const myWinOnLoad = () => {
                  try{
                      if( bWinIframe ) {
                          elIframe.contentWindow.postMessage({type:"PegaAuth"}, redirectOrigin);
                          // eslint-disable-next-line no-console
                          console.log("authjs(login): loaded a page in iFrame");
                      } else {
                          myWindow.postMessage({type:"PegaAuth"}, redirectOrigin);
                      }
                  } catch(e) {
                      // eslint-disable-next-line no-console
                      console.log("authjs(login): Exception trying to postMessage on load");
                  }
              };
              const fnOpenPopup = () => {
                  myWindow = window.open(url, '_blank', 'width=700,height=500,left=200,top=100');
                  if( !myWindow ) {
                      // Blocked by popup-blocker
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return reject("blocked");
                  }
                  checkWindowClosed = setInterval( () => {
                      if( myWindow.closed ) {
                          clearInterval(checkWindowClosed);
                          // eslint-disable-next-line prefer-promise-reject-errors
                          reject("closed");
                      }
                  }, 500);
                  try {
                      myWindow.addEventListener("load", myWinOnLoad, true);
                  } catch(e) {
                      // eslint-disable-next-line no-console
                      console.log("authjs(login): Exception trying to add onload handler to opened window;")
                  }
              };

              const fnCloseIframe = () => {
                elIframe.parentNode.removeChild(elIframe);
                elCloseBtn.parentNode.removeChild(elCloseBtn);
                // eslint-disable-next-line no-multi-assign
                elIframe = elCloseBtn = null;
                bWinIframe = false;
              };
              const fnCloseAndReject = () => {
                fnCloseIframe();
                // eslint-disable-next-line prefer-promise-reject-errors
                reject("closed");
              };
              // If there is a userIdentifier and password specified or an external SSO auth service,
              //  we can try to use this silently in an iFrame first
              if( bWinIframe ) {
                  const nFrameZLevel = 99999;
                  elIframe = document.createElement('iframe');
                  // eslint-disable-next-line prefer-template
                  elIframe.id = 'pe'+this.config.clientId;
                  const loginBoxWidth=500;
                  const loginBoxHeight=700;
                  const oStyle = elIframe.style;
                  oStyle.position = 'absolute';
                  oStyle.display = 'none';
                  oStyle.zIndex = nFrameZLevel;
                  oStyle.top=`${Math.round(Math.max(window.innerHeight-loginBoxHeight,0)/2)}px`;
                  oStyle.left=`${Math.round(Math.max(window.innerWidth-loginBoxWidth,0)/2)}px`;
                  oStyle.width='500px';
                  oStyle.height='700px';
                  // Add Iframe to top of document DOM to have it load
                  document.body.insertBefore(elIframe,document.body.firstChild);
                  // Add Iframe to DOM to have it load
                  document.getElementsByTagName('body')[0].appendChild(elIframe);
                  elIframe.addEventListener("load", myWinOnLoad, true);
                  // Disallow iframe content attempts to navigate main window
                  elIframe.setAttribute("sandbox","allow-scripts allow-forms allow-same-origin");
                  elIframe.setAttribute('src', url);

                  const svgCloseBtn =
                  `<?xml version="1.0" encoding="UTF-8"?>
                  <svg width="34px" height="34px" viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <title>Dismiss - Black</title>
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(1.000000, 1.000000)">
                        <circle fill="#252C32" cx="16" cy="16" r="16"></circle>
                        <g transform="translate(9.109375, 9.214844)" fill="#FFFFFF" fill-rule="nonzero">
                          <path d="M12.7265625,0 L0,12.6210938 L1.0546875,13.5703125 L13.78125,1.0546875 L12.7265625,0 Z M13.7460938,12.5507812 L1.01953125,0 L0,1.01953125 L12.7617188,13.6054688 L13.7460938,12.5507812 Z"></path>
                        </g>
                      </g>
                    </g>
                  </svg>`;
                  const bCloseWithinFrame = false;
                  elCloseBtn = document.createElement('img');
                  elCloseBtn.onclick = fnCloseAndReject;
                  // eslint-disable-next-line prefer-template
                  elCloseBtn.src = 'data:image/svg+xml;base64,' + window.btoa(svgCloseBtn);
                  const oBtnStyle = elCloseBtn.style;
                  oBtnStyle.cursor = 'pointer';
                  // If svg doesn't set width and height might want to set oBtStyle width and height to something like '2em'
                  oBtnStyle.position = 'absolute';
                  oBtnStyle.display = 'none';
                  oBtnStyle.zIndex = nFrameZLevel+1;
                  const nTopOffset = bCloseWithinFrame ? 5 : -10;
                  const nRightOffset = bCloseWithinFrame ? -34 : -20;
                  oBtnStyle.top = `${Math.round(Math.max(window.innerHeight-loginBoxHeight,0)/2)+nTopOffset}px`;
                  oBtnStyle.left = `${Math.round(Math.max(window.innerWidth-loginBoxWidth,0)/2)+loginBoxWidth+nRightOffset}px`;
                  document.body.insertBefore(elCloseBtn,document.body.firstChild);
                  // If the password was wrong, then the login screen will be in the iframe
                  // ..and with Pega without realization of US-372314 it may replace the top (main portal) window
                  // For now set a timer and if the timer expires, remove the iFrame and use same url within
                  // visible window
                  tmrAuthComplete = setTimeout( () => {
                      clearTimeout(tmrAuthComplete);
                      // remove password from config
                      if( this.config.password ) {
                          delete this.config.password;
                          this.#updateConfig();
                      }

                      if( this.config.iframeLoginUI ) {
                        elIframe.style.display="block";
                        elCloseBtn.style.display="block";
                    } else {
                        fnCloseIframe();
                        fnOpenPopup();
                    }
                  }, iframeTimeout);
              } else {
                  fnOpenPopup();
              }

              let authMessageReceiver = null;
              /* Retrieve token(s) and close login window */
              const fnGetTokenAndFinish = (code) => {
                  window.removeEventListener("message", authMessageReceiver, false);
                  this.getToken(code).then(token => {
                      if( bWinIframe ) {
                          clearTimeout(tmrAuthComplete);
                          fnCloseIframe();
                      } else {
                          clearInterval(checkWindowClosed);
                          myWindow.close();
                      }
                      resolve(token);
                  })
                  .catch(e => {
                      reject(e);
                  });
              };
              /* Handler to receive the auth code */
              authMessageReceiver = (event) => {
                  // Check origin to make sure it is the redirect origin
                  if( event.origin !== redirectOrigin )
                      return;
                  if( !event.data || !event.data.type || event.data.type !== "PegaAuth" )
                      return;
                  // eslint-disable-next-line no-console
                  console.log("authjs(login): postMessage received with code");
                  const code = event.data.code.toString();
                  fnGetTokenAndFinish(code);
              };
              window.addEventListener("message", authMessageReceiver, false);
              window.authCodeCallback = (code) => {
                  // eslint-disable-next-line no-console
                  console.log("authjs(login): authCodeCallback used with code");
                  fnGetTokenAndFinish(code);
              };
          });
      });
  }

  // Login redirect
  loginRedirect() {
      // eslint-disable-next-line no-restricted-globals
      const state = btoa(location.origin);
      this.#buildAuthorizeUrl(state).then((url) => {
          // eslint-disable-next-line no-restricted-globals
          location.href = url;
      });
  }


  // For PKCE token endpoint includes code_verifier
  getToken(authCode) {
      // Reload config to pick up the previously stored codeVerifier
      this.reloadConfig();

      const {clientId, clientSecret, redirectUri, tokenUri, codeVerifier} = this.config;

      // eslint-disable-next-line no-restricted-globals
      const queryString = location.search;
      const urlParams = new URLSearchParams(queryString);
      const code = authCode || urlParams.get("code");

      const formData = new URLSearchParams();
      formData.append("client_id", clientId);
      if( clientSecret ) {
          formData.append("client_secret", clientSecret);
      }
      formData.append("grant_type", "authorization_code");
      formData.append("code", code);
      formData.append("redirect_uri", redirectUri);
      formData.append("code_verifier", codeVerifier);

      return fetch(tokenUri, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/x-www-form-urlencoded",
        }),

        body: formData.toString(),
      })
      .then((response) => response.json())
      .then(token => {
          // .expires_in contains the # of seconds before access token expires
          // add property to keep track of current time when the token expires
          token.eA = Date.now() + (token.expires_in * 1000);
          if( this.config.codeVerifier ) {
              delete this.config.codeVerifier;
          }
          // If there is a session_index then move this to the peConfig structure (as used on authorize)
          if( token.session_index ) {
              this.config.sessionIndex = token.session_index;
          }
          // If we got a token and have a session index, then reset the sessionIndexAttempts
          if( this.config.sessionIndex ) {
            this.config.sessionIndexAttempts = 0;
          }
          this.#updateConfig();
          return token;
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e)
      });
  }

  /* eslint-disable camelcase */
  async refreshToken(refresh_token) {
      const {clientId, clientSecret, tokenUri} = this.config;

      const formData = new URLSearchParams();
      formData.append("client_id", clientId);
      if( clientSecret ) {
          formData.append("client_secret", clientSecret);
      }
      formData.append("grant_type", "refresh_token");
      formData.append("refresh_token", refresh_token);

      return fetch(tokenUri, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/x-www-form-urlencoded",
        }),

        body: formData.toString(),
      })
      .then((response) => {
        if( !response.ok && response.status === 401 ) {
            return null;
        }
        return response.json();
      })
      .then(token => {
          if( token ) {
              // .expires_in contains the # of seconds before access token expires
              // add property to keep track of current time when the token expires
              token.eA = Date.now() + (token.expires_in * 1000);
          }
          return token;
      })
      .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e)
      });
  }

  async revokeTokens(access_token, refresh_token = null) {
      if( !this.config || !this.config.revokeUri) {
          // Must have a config structure and revokeUri to proceed
          return;
      }
      const {clientId, clientSecret, revokeUri} = this.config;

      const hdrs = {"content-type":"application/x-www-form-urlencoded"};
      if( clientSecret ) {
          const creds = `${clientId}:${clientSecret}`;
          hdrs.authorization = `Basic ${window.btoa(creds)}`;
      }
      const aTknProps = ["access_token"];
      if( refresh_token ) {
        aTknProps.push("refresh_token");
      }
      aTknProps.forEach( (prop) => {
          const formData = new URLSearchParams();
          if( !clientSecret ) {
              formData.append("client_id", clientId);
          }
          formData.append("token", prop==="access_token" ? access_token : refresh_token);
          formData.append("token_type_hint", prop);
          fetch(revokeUri, {
              method: "POST",
              headers: new Headers(hdrs),
              body: formData.toString(),
          })
          .then((response) => {
              if( !response.ok ) {
                  // eslint-disable-next-line no-console
                  console.log( `Error revoking ${prop}:${response.status}` );
              }
          })
          .catch(e => {
              // eslint-disable-next-line no-console
              console.log(e);
          });
      } );
      // Also clobber any sessionIndex
      if( this.config.sessionIndex ) {
        delete this.config.sessionIndex;
        this.#updateConfig();
      }
  }

  // For userinfo endpoint to return meaningful data, endpoint must include appAlias (if specified) and authorize must
  //  specify profile and optionally email scope to get such info returned
  async getUserinfo(access_token) {
    if( !this.config || !this.config.userinfoUri ) {
          // Must have a config structure and userInfo to proceed
          return {};
    }
    const hdrs = {'authorization':`bearer ${access_token}`,'content-type':'application/json;charset=UTF-8'};
    return fetch(this.config.userinfoUri, {
        method: "GET",
        headers: new Headers(hdrs)})
    .then( response => {
        if( response.ok) {
            return response.json();
        } else {
            // eslint-disable-next-line no-console
            console.log( `Error invoking userinfo: ${response.status}` );
        }
    })
    .then( data => {
        return data;
    })
    .catch(e => {
        // eslint-disable-next-line no-console
        console.log(e);
    });
  }

  /* eslint-enable camelcase */

  // eslint-disable-next-line class-methods-use-this
  #sha256Hash(str) {
      return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  }

  // Base64 encode
  // eslint-disable-next-line class-methods-use-this
  #encode64(buff) {
      return window.btoa(new Uint8Array(buff).reduce((s, b) => s + String.fromCharCode(b), ''));
  }

  /*
   * Base64 url safe encoding of an array
   */
  #base64UrlSafeEncode(buf) {
      const s = this.#encode64(buf).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      return s;
  }

  /* Calc code verifier if necessary
   */
  /* eslint-disable camelcase */
  #getCodeChallenge(code_verifier) {
      return this.#sha256Hash(code_verifier).then (
          (hashed) => {
            return this.#base64UrlSafeEncode(hashed)
          }
      ).catch(
          (error) => {
            // eslint-disable-next-line no-console
            console.log(error)
          }
      ).finally(
          () => { return null }
      )
  }
  /* eslint-enable camelcase */

}

export default PegaAuth;
