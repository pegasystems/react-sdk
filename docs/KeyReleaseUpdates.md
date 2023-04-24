## 24-April-2023 - Major change to React SDK Packaging
<br />
<h3>On <strong>April 24, 2023</strong>, a <strong>significant update</strong> to the React SDK <strong>main</strong> branch was completed.</h3>
<br />

**We strongly recommend that existing SDK users** clone the update into a new working folder locally. The existing SDK folder structure has significantly changed and may result in the deletion of folders in your local working copy.   Some recommendations on how to migrate your existing components to the new SDK will be published on the release date, along with a comprehensive set of documentation updates describing the new capabilities (navigate to **https://docs.pega.com** and then search for 'Constellation SDKs').

**For any SDK user who wants to remain on the <u>old</u> main branch**, check out the following branch which is available <strong>now</strong>:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**release/8.8.10**

The updates made to the <strong>main</strong> branch reflect a significant repackaging of the React SDK that addresses 2 key improvements:

1.	The **DX Component Builder tool** for creating custom DX components is **fully integrated** into the SDK. There is no longer a need to create custom components with a separate tool (in a separate folder structure) and then copy the components into the SDK.

2.	The Pega-provided React SDK components have been moved into an npm package (@pega/react-sdk-components) that is a new dependency for the React SDK. This means that a new React SDK project provides an **empty component structure** that will only contain the SDK user’s code without the clutter of the Pega provided components. SDK users will add their components to the project by creating custom components or overriding existing Pega components. It also allows for easier updates to the Pega-provided components since updates to the npm package won’t directly affect the SDK user’s code.

A <strong>new repo</strong> (from which the @pega/react-sdk-components and @pega/react-sdk-overrides packages are created) will be public and open source soon. When it becomes public, the source code for the React SDK components will be available there. Until then, the source code for the components
can be found in the node_modules/@pega/react-sdk-overrides/lib directory.
<br /><br />
<hr />

<br />

### Pega Constellation SDKs available:
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
