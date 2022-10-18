## Release SDK-R.87.3
* Added support for Infinity 8.7.2
* Added use of npm dependency to get necessary ConstellationJS Engine files (see package.json @pega/constellationjs dependency)
* Added support for DataReference component
* Added playwright smoke tests that can be run against the MediaCo sample app
* Improvements to auth code and to make it easier to deploy the SDK on a different web server (ex: Tomcat)
* Support for "save for later" button to local action in modal dialog

## Release SDK-R.87.2
* This release provides support for Infinity 8.7.0 **and** 8.7.1
* Added Attachment form component
* Added FileUtility component that allows attaching documents or links
* Improved updating of Vertical Tab component via DeferLoad
* Can open a ToDo item after cancelling out of a form step
* Support for View inside a View (including not losing focus)
* Updated **Phone** component with improved formatting (material-ui-phone-number component)
* Added support for form-level "instructions" text

## Release SDK-R.87.1
* This is the first public release of the React SDK for Infinity 8.7.
* This SDK release supports Infinity **8.7.0**.
* Use the corresponding ConstellationJS files found in the SDK-R.87.1 download from Pega Marketplace: https://community.pega.com/marketplace/components/react-sdk
* The React SDK does not include every component that a Constellation application supports. At this time, we provide the most commonly used components to get you started with your application.

## Release SDK-R.87.0
* This was the initial, Pega internal ony release of the React SDK for Infinity 8.7.

<br />

<hr />

### About the SDK version naming: \<**SDK**>.\<**InfinityVersion**>.\<**SDK-release**>

**An example: SDK-R.87.0**
* **SDK-R** indicates that this is the React SDK. The React SDK provides a React-based bridge and associated components that connect to the ConstellationJS Engine. The SDK provides support for design systems based on React other than Pega's Cosmos React design system.
* **87** indicates that this version of the SDK is applicable to Pega Infinity version 87.*
* **0** indicates that this is the initial release of the SDK for Infinity 8.7. Even though this is the initial release, it _may_ still be applicable for Infinity 8.7.0, 8.7.1, etc. Check the SDK Marketplace page to find the SDK release that works with the Infinity point release you require.
<hr />

<br />

### Pega SDKs available:
* **Angular SDK**:
  * Marketplace: https://community.pega.com/marketplace/components/angular-sdk
  * Github: https://github.com/pegasystems/angular-sdk

<br />

* **React SDK**:
  * Marketplace: https://community.pega.com/marketplace/components/react-sdk
  * Github: https://github.com/pegasystems/react-sdk

<br />

* **Web Components SDK**:
  * Marketplace: https://community.pega.com/marketplace/components/web-components-sdk
  * Github: https://github.com/pegasystems/web-components-sdk
