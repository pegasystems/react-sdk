// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
class PegaAuth {

    constructor(config) {
        this.config = config;
    }

    // For PKCE token endpoint includes code_verifier
    getToken(authCode) {

        const {clientId, clientSecret, redirectUri, tokenUri} = this.config;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = authCode || urlParams.get("code");

        const formData = new URLSearchParams();
        formData.append("client_id", clientId);
        if (clientSecret) {
          // don't add if no client secret passed in
          formData.append("client_secret", clientSecret);
        }
        formData.append("grant_type", "authorization_code");
        formData.append("code", code);
        formData.append("redirect_uri", redirectUri);
        formData.append("code_verifier", sessionStorage.getItem("pega_cv"));

        return fetch(tokenUri, {
          method: "POST",
          headers: new Headers({
            "content-type": "application/x-www-form-urlencoded",
          }),

          body: formData.toString(),
        })
          .then((response) => response.json())
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log(e)
          });
      }

      // For PKCE the authorize includes a code_challenge & code_challenge_method as well
      readAuthCode() {
        const {clientId, redirectUri, authorizeUri, authService} = this.config;

        // Generate random string of 64 chars for verifier.  RFC 7636 says from 43-128 chars
        let buf = new Uint8Array(64);
			  window.crypto.getRandomValues(buf);
        const codeVerifier = this.base64UrlSafeEncode(buf);
        // Persist this value in session storage so it survives the redirects that are to follow
        sessionStorage.setItem("pega_cv", codeVerifier);

        // Cal random state variable
        buf = new Uint8Array(32);
        window.crypto.getRandomValues(buf);
        const state = this.base64UrlSafeEncode(buf);

        this.getCodeChallenge(codeVerifier).then( cc => {
          window.location.href = `${authorizeUri}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=openid&state=${state}&code_challenge=${cc}&code_challenge_method=S256&authentication_service=${authService}`
				});
      }

      // eslint-disable-next-line class-methods-use-this
      sha256Hash(str) {
        return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
      }

      // Base64 encode
      // eslint-disable-next-line class-methods-use-this
      encode64(buff) {
        return btoa(new Uint8Array(buff).reduce((s, b) => s + String.fromCharCode(b), ''));
      }

      /*
       * Base64 url safe encoding of an array
       */
      base64UrlSafeEncode(buf) {
        const s = this.encode64(buf).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
        return s
      }

      /* Calc code verifier if necessary
       */
      getCodeChallenge(codeVerifier) {
        return this.sha256Hash(codeVerifier).then (
          (hashed) => {
            return this.base64UrlSafeEncode(hashed)
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

}
