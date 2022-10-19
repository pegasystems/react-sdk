<p align="center"><img width=60% src="docs/media/ReactSDK-Logo.png">

# React SDK

The **React SDK** provides Pega customers with the ability to build DX components that connect Pega’s ConstellationJS Engine APIs with a design system other than Pega Cosmos.

The React SDK differs from out-of-the-box Constellation design system because it provides and demonstrates the use of a React design system that is not the Pega **Constellation** design system. The alternative design system used in this React SDK is **Material UI** (https://mui.com/).

The React SDK is built on a new and modernized UI technology stack (the Constellation JavaScript Engine and Constellation JavaScript API). Many additional SDK features are planned for 1H 2022 to expand the scope of supported use cases.


<br>

# Prerequisites

## Pega Infinity Server and Constellation-enabled Application

This **8.7 version** of the React SDK assumes that you have access to a Pega Infinity server (**8.7.0+ GA**) running an application that is configured to run using the Constellation UI service.

The **MediaCo** sample application is already configured as a Constellation application and can be found in the React SDK download associated with this repo which is available at [https://community.pega.com/marketplace/components/react-sdk](https://community.pega.com/marketplace/components/react-sdk). The OAuth 2.0 Client Registration records associated with the **MediaCo** application are available in the same React SDK download. For more information about the MediaCo sample application, see [MediaCo sample application](https://docs-previous.pega.com/constellation-sdks/mediaco-sample-application).

The **React SDK** has been tested with:
- node 14.18.*
- npm 6.14.*

Future updates to the SDK will support more recent LTS versions of node as Constellation supports them.

**Before** installing and running the SDK code, refer to the **React SDK Guide** provided in the Marketplace download for steps to prepare your Infinity server and node environment so you can proceed with the steps in the next section.



<br>

---
# Installing and Running the Application

### **Install** the React SDK code

See the React SDK Guide available at Pega Marketplace for complete instructions.

1. Install

    ```
    $ cd <kit location>

    (This next step is strongly recommended if you have a node_modules directory installed from an earlier version of the kit)
    $ rm -rf node_modules

    $ npm install
    ```

   At this time, you will note that there are 3 “high-security vulnerabilities” reported by Node related to the “trim” package. Research into these reported issues indicates that these flags represent more of a possible slowdown than a security-exploit problem. (See https://github.com/mdx-js/mdx/discussions/1864) We are following this and will provide an update this issue is resolved. Since these issues are related to linting of Markdown files, if you are concerned about these reports, you can remove the eslint-plugin-mdx and @pega/configs devDependencies and use the SDK without linting. These issues have no impact on the SDK's runtime.

Also, if you run ```npm install``` after it has already been run once, you may see several warnings related to npm peer dependencies that are related to various lint packages. You can ignore these warnings as they affect the linting and are not associated with the runtime behavior.


### **Configure** the React SDK

See the **React SDK Guide** in the Marketplace download for more complete documentation about the configuration of the React SDK via the **sdk-config.json**
file.

2. Edit **sdk-config.json** and, if necessary, update the values that will be used. For more information about the attributes in the **sdk-config.json** file, see [Configuring the sdk-config.json file](https://docs-previous.pega.com/constellation-sdks/configuring-sdk-configjson-file).
    * The **authConfig** section contains values related to the OAuth 2.0 client
    registration record you will be using and Operator ID and login information
    related to the /embedded use. The default **sdk-config.json** file is set up to use the **MediaCo_ReactSDK** record that is included with the React SDK Marketplace download.<br><br>
      * **authService** specifies the authentication service that will be used by the Infinity server to authenticate Operator IDs. The default configuration uses the built-in Infinity authentication service: **pega**.
      * **mashupClientID** specifies the Client ID of the Infinity OAuth 2.0 Client
      Registration record that will be used by the SDK for the **/embedded** use.
      * **mashupUserIdentifier** specifies the Operator ID that will be logged in
      automatically on behalf of the user for the /embedded use.
      * **mashupPassword** specifies the base64 encoding of the password for the
      Operator ID given in the **mashupUserIdentifier** (above). You can use a tool such as [https://www.base64encode.org](https://www.base64encode.org) to
      generate a base64 encoding from a plaintext string. **NOTE**: The **/embedded** use _**will not work**_ until the correct password is provided in
      this configuration setting!
      * **portalClientID** specifies the Client ID of the Infinity OAuth 2.0 Client
      Registration record that will be used by the SDK for the **/portal** use.
   <br><br>
    * The **serverConfig** section contains values related to the Pega Infinity server and SDK Content Server.
      * **infinityRestServerUrl** indicates where the SDK expects to find the Infinity REST server. The default configuration is set to **https://localhost:1080/prweb**. You will need to change this if you are using a different path to access your Infinity server.
      * **appAlias** is the application alias that operatorIDs logging into this instance of the React SDK content server will use. (E.g., "MediaCo").
      When specified, this value will be used to further constrain the REST URL that the Constellation JavaScript Engine uses when making REST calls to Infinity. It is **_strongly recommended_** that the appAlias value be set before putting an application into production. If this is not specified, the server will always utilize the _default_ access group specified within the `Application access` area for the current Operator when invoking any DX API REST calls. Hence, not specifying the appAlias will result in application access issues for all applications other than the operator's designated default application.
    <br><br>

3. Edit the **package.json** file's dependency for **[@pega/constellationjs](https://www.npmjs.com/package/@pega/constellationjs)** with the **tag name** that is appropriate for the Pega Infinity version that your application is running. For example, Infinity 8.6.3 uses the tag "**SDK-8.6.3**", Infinity 8.6.4 uses the tag "**SDK-8.6.4**", etc. You must **always** use the appropriate Constellation files that match your Infinity deployment.
<br><br>


### **Run** the application

4. **Development build and start (1 terminal)**

   Note that development mode uses **webpack-dev-server**.
   that is configured as a “live reload” server. This means that, when running one of the start-dev commands, **saving** a file in your editor will trigger a **re-compile** and **reload** of the page. This page reload may result in your application popping a new login window. If this occurs, log in and your code changes will be available for further testing and development.

    4.1 Full development clean and install of npm modules, and build; then start the server
   ```
   $ npm run build:dev:ci
   $ npm run start-dev (or start-dev-https)
   ```
   or <br>


    4.2 Build and run (assumes npm install has already been run)
   ```
   $ npm run build:dev
   $ npm run start-dev (or npm run start-dev-https)
   ```

5. **Production build and start (1 terminal)**

    5.1 Full production clean and install of npm modules, and build; then start the server. (Building in production mode
    generates gzip and Brotli compressed versions of the static content. Serving in production mode will serve the
    gzip or Brotli static content when available.)
   ```
   $ npm run build:prod:ci
   $ npm run start-prod (or start-prod-https)
   ```
   or <br>

    5.2 Build and start the server (assumes npm install has already been run)
   ```
   $ npm run build:prod
   $ npm run start-prod (or start-prod-https)
   ```

<br>

### **Access** the sample application from your browser

**NOTE**: It is _**strongly recommended**_ that you confirm
that the **MediaCo** sample application is working for **both** the **/portal**
and **/embedded** usage before you try to get the SDK working for your
own application. This will validate the SDK installation with a known good
application.


6. **Embedded**

    6.1 Access **http://localhost:3502/embedded** or **https://localhost:3502/embedded** (if ```run start-*-https``` is used)

7.  **Portal**

    7.1 Access **http://localhost:3502/portal** or **https://localhost:3502/portal** (if ```run start-*-https``` is used)

    **If you see a blank page**, check your JavaScript console to see if you have encountered a net::ERR_CERT_INVALID error. If you encounter this error, see the troubleshooting section below: **Runtime Error: net::ERR_CERT_INVALID**. Due to browser interactions during login, it can be easier to find and fix this error using the Portal URL.

Note that the examples above are for the default configuration. If you change the configuration to use a different host and/or port, adapt these URLs to your host:port as necessary.

<br>

---

## Testing the application
<br>

You can test both **Portal** and **Embedded** scenarios by executing the following commands in the terminal:

1. ```
   $ npm run build:dev:ci
   ```

2. ```
   $ npm run start-dev (and leave it running)
   ```

3. Open a different terminal window or tab (since start-dev is still running)

4.  **Executing the tests**:

    4.1 Execute the Portal test-
      ```
      $ npm run test -- portal
      ```

      or <br>

    4.2 Execute the Embedded test:
      ```
      $ npm run test -- embedded
      ```

      or <br>

    4.3 Execute both tests simultaneously-
      ```
      $ npm run test
      ```

   <br>

5. **Getting the test report**:

   To get the test report of last run:

   ```
   npx playwright show-report
   ```


> **NOTE**: These tests execute the sample **MediaCo** application. For more information, see [Testing the MediaCo sample application](https://docs-previous.pega.com/constellation-sdks/testing-mediaco-sample-application).

<br>

---


## Some setup and troubleshooting tips
<br>

> **NOTE**: These setup tips are abstracted from the React SDK Guide that is available to licensed Pega Infinity clients at [https://community.pega.com/media/react-sdk-87-guide](https://community.pega.com/media/react-sdk-87-guide). For more information about troubleshooting, see [Troubleshooting the Constellation SDKs](https://docs-previous.pega.com/constellation-sdks/troubleshooting-constellation-sdks).

<br>

### Check Node/NPM versions
Currently, the SDK supports **Node 14**. It has been tested with node v14.18.*. It may not be stable with node v16+. Future updates to the SDK will support more recent LTS versions of node as the Constellation architecture supports them.


### Verify/update Cross Origin Resource Sharing (CORS) Infinity record

The **APIHeadersAllowed** record on your Infinity server (found in Security | Cross Origin Resource Sharing) may need to be updated to allow the React SDK calls to Pega REST APIs and DX APIs to interact with Infinity.

For the **APIHeadersAllowed** CORS record, confirm or update the record as follows:

* **Allowed methods**
  * **All 5 methods** should be checked:
  **GET, POST, PUT, PATCH, and DELETE**

* **Allowed headers**
  * The list of allowed request header should include the following:
  **authorization, content-type, Access-Control-Expose-Headers, If-Match, pzCTKn, context, remotesystemid**

* Exposed headers
  * The list of allowed exposed headers should include the following:
  **etag, remotesystemid**

* **Save** the record - **APIHeadersAllowed** – after making any changes.

<br>

### Runtime Error: net::ERR_CERT_INVALID

Browsers are less tolerant of local, self-signed certificates or when no local, self-signed certificate exists. If you don’t have a trusted self-signed certificate and launch your application, you may see a blank screen accompanied by an error similar to this in your JS console:

POST https://localhost:1080/prweb/PRRestService/oauth2/v1/token **net::ERR_CERT_INVALID**

Typically, you can resolve this error by indicating to your browser that you are willing to trust the local certificate that’s being used. Here are a few links that we’ve found useful for solving this problem for various browsers:

* https://kinsta.com/knowledgebase/neterr-cert-authority-invalid/

* https://stackoverflow.com/questions/65816432/disable-any-cert-check-on-localhost-on-chrome

* In Chrome, Brave, or Edge, you can temporarily resolve this error by enabling the “Allow invalid certificates for resources loaded from localhost using this URL:
[chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost)




<br>

---

### Verify/update OAuth 2.0 Client Registration Infinity records

The **React SDK** sample application is preconfigured to use the **MediaCo_ReactSDK** Client Registration record that is included in the React SDK download available at [https://community.pega.com/marketplace/components/react-sdk](https://community.pega.com/marketplace/components/react-sdk). This Client Registration record is used for the **Embedded** and **Portal** use cases.

You may use this existing registration record. If you want to create your own OAuth 2.0 Client Registration record, refer to the **How to create OAuth2 registration in Infinity** section found below.

* For the **Embedded** use case, you will use the OAuth 2.0 Client Registration record’s **Client ID** as the value for **mashupClientId** in the SDK’s **sdk-config.json** file.

* For the **Portal** use case, you will use the OAuth 2.0 Client Registration record’s **Client ID** as the value of **portalClientId** in the SDK’s **sdk-config.json** file.


To ensure that the application is redirected to the proper page after authentication succeeds, you may need to update the OAuth 2.0 Client Registration record’s **List of redirect URIs** shown in the record’s **Supported grant types** section.

The **MediaCo_ReactSDK** record includes the necessary redirect URIs for the default configuration:

* http://localhost:3502/auth.html and https://localhost:3502/auth.html for all Embedded use cases as well as for any full reAuthentication challenges for non-embedded use cases

* http://localhost:3502/portal and https://localhost:3502/portal for initial authentication for the Portal use case

If you configure your installation to have the React SDK static content served from a different **host:port** than the default, you should add new Redirect URIs to the list:

* In the **Supported grant types** section add the following URLS to the list of redirect URLs by clicking on the + sign. (Note that the default port is 3502.)

  * http://\<**host name or IP address of React SDK server**>:<**port you’re using**>/auth.html (for the embedded use case as well as for any full re-authentication scenarios for any sample page)

  * https://\<**host name or IP address of React SDK server**>:<**port you’re using**>/auth.html (for the embedded use case as well as for any full re-authentication scenarios for any sample page)

  * http://\<**host name or IP address of React SDK server**>:<**port you’re using**>/portal (for initial authentication for the portal use case)

  * https://\<**host name or IP address of React SDK server**>:<**port you’re using**>/portal (for initial authentication for the portal use case)

  * Note that entries are needed for either **http** or **https** depending on how you access your React SDK server

 * **Save** the record

<br>

---

### How to create an OAuth 2.0 Client Registration record in Infinity

When preparing your Infinity server for use with the `React SDK`, a `MediaCo_ReactSDK` OAuth 2.0 Client Registration record will have been imported. That record's Client Id is currently referenced within sdk-config.json. However, you can create your own OAuth 2.0 Client Registration record using the following procedure:
   * Create a new "Security/OAuth 2.0 Client Registration" record for your app
   * You might name it the same name as your application
   * Specify "Public" for the type of client
   * Select "Authorization Code" for the Grant type
   * Add RedirectURI values based on what was specified above: auth.html as well as ones for any non-embedded scenarios you want to directly access via a url. For non-embedded portal scenarios, it will redirect back to that same portal page route
   * Enable the "Enable proof code for PKCE" option
   * Set the "Access token lifetime" to the interval you want the logged-in session to last before the token is silently refreshed. We recommend somewhere between 10 minutes (600) and at most 60 minutes (3600).
   * Set the "Refresh token lifetime" to the interval before the user should encounter a full re-authentication challenge. We recommend somewhere between 18 hours (64800) and 24 hours (86400).
   * Enter the appropriate values within **sdk-config.json**

<br>

---

### Setting up a secure self-signed certificate for localhost


The following steps will enable setting up a secure self-signed certificate for localhost (adapted from the procedure outlined here: https://gist.github.com/pgilad/63ddb94e0691eebd502deee207ff62bd). At the end of the process two files are expected within the root project directory: private.pem and private.key

Step 1: Create a private key
   ```
   $ openssl genrsa -out private.key 4096
   ```


Step 2: Create a Certificate configuration text file named ssl.conf within the root project directory. Use the following (or adjusted content to reflect your location and desired organization):
   ```
[ req ]
default_bits       = 4096
distinguished_name = req_distinguished_name
req_extensions     = req_ext

[ req_distinguished_name ]
countryName                 = US
countryName_default         = US
stateOrProvinceName         = Massachusetts
stateOrProvinceName_default = Massachusetts
localityName                = Westford
localityName_default        = Westford
organizationName            = Pegasystems
organizationName_default    = Pegasystems
organizationalUnitName      = DXIL
organizationalUnitName_default = DXIL
commonName                  = localhost
commonName_max              = 64
commonName_default          = localhost

[ req_ext ]
subjectAltName = @alt_names

[alt_names]
DNS.1   = localhost
   ```

Step 3: Create a Certificate Signing Request (will be prompted for a passphrase for new key)

   ```
   $ openssl req -new -sha256 -out private.csr -in private.key -config ssl.conf
   ```


Step 4: Generate the Certificate
   ```
   $ openssl x509 -req -days 3650 -in private.csr -signkey private.key -out private.crt -extensions req_ext -extfile ssl.conf
   ```

Step 5: Add the Certificate to the keychain and trust it (will be prompted for Mac system password)
   ```
   $ sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain private.crt
   ```

Step 6: Create a pem file from crt
   ```
   $ openssl x509 -in private.crt -out private.pem -outform PEM
   ```
Step 7: Run webpack server with arguments to use the keys (assumes private.pem and private.key are in root project directory). You may need to close prior open instances of browser (if previously accessed prior insecure localhost)

   ```
   $ npm run localhostsecure
   ```
<br>

---

   ## License

This project is licensed under the terms of the **Apache 2** license.

>You can see the full license [here](LICENSE) or directly on [apache.org](https://www.apache.org/licenses/LICENSE-2.0).

<br>

---

## Contributing

We welcome contributions to the React SDK project.

Refer to our [guidelines for contributors](./docs/CONTRIBUTING.md) if you are interested in contributing to the project.

<br>


---

## Additional Resources

* [Material UI](https://v4.mui.com/)
* [Constellation SDK Documentation](https://docs-previous.pega.com/constellation-sdks/constellation-sdks)
* [Troubleshooting the Constellation SDKs](https://docs-previous.pega.com/constellation-sdks/troubleshooting-constellation-sdks)
* [MediaCo sample application](https://docs-previous.pega.com/constellation-sdks/mediaco-sample-application)
