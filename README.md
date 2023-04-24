<p align="center"><img width=60% src="docs/media/ReactSDK-Logo.png">

# React SDK - Release Announcement

This is the latest version of the React SDK and it provides many new features that are documented here: 

[What's new in the SDK?](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/whats-new-sdk.html) and also outlined below:

The following list shows some of the key features and changes in this release:
- Constellation DX component builder integration to enable creating custom components and overriding Pega (requires Infinity 8.8.3 or higher) components using the SDK. For more information, see [Using the integrated DX component builder](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/using-dx-component-builder.html).
- Storybook integration to mock and test components in isolation. For more information, see [Storybook integration](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/using-dx-component-builder.html#ref-sdk-dx-component-builder-integration__section_j3h_fnj_2xb).
- Component management capabilities, such as build, publish, and delete components. For more information, see [Managing components](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/managing-components.html).
- Updated authentication and authorization module. For more information, see [Authentication and authorization](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/authentication-authorization.html).
- Updated src directory structure to house component code based on component category (custom and override) and component type (field, template, and widget). For more information, see [Updated files](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/using-dx-component-builder.html#ref-sdk-dx-component-builder-integration__section_d1d_1vc_xwb).
- Updated sdk-config.json file with component configuration attributes, such as dxcbConfig. For more information, see [dxcbConfig](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/configuring-sdk-config-json.html#configuring-the-sdk-config-json-con__section_gng_ttk_cxb).

---

***IMPORTANT:***  Please follow the guidelines documented here if you are upgrading from a previous version of React SDK: [Upgrading the SDK](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/upgrading-sdk.html)

If you want to continue using the previous release you can checkout [release/8.8.10](https://github.com/pegasystems/react-sdk/tree/release/8.8.10)

---


# Overview

The **React SDK** provides Pega customers with the ability to build DX components that connect Pega’s ConstellationJS Engine APIs with a design system other than Pega Cosmos.

The React SDK differs from out-of-the-box Constellation design system because it provides and demonstrates the use of a React design system that is not the Pega **Constellation** design system. The alternative design system used in this React SDK is **Material UI** (https://mui.com/).

The React SDK is built on a new and modernized UI technology stack (the JavaScript ConstellationJS Orchestration engine and Public API). Many additional SDK features are planned for 1H 2022 to expand the scope of supported use cases.


<br>

# Prerequisites

## Pega Infinity Server and Constellation-enabled Application

This version of the React SDK assumes that you have access to a Pega Infinity server (**8.8.0+ GA or 8.7.0+ GA**) running an application that is configured to run using the Constellation UI service.

The **MediaCo** sample application is already configured as a Constellation application and can be found in the React SDK download associated with this repo which is available at [https://community.pega.com/marketplace/components/react-sdk](https://community.pega.com/marketplace/components/react-sdk). The OAuth 2.0 Client Registration records associated with the **MediaCo** application are available in the same React SDK download. For more information about the MediaCo sample application, see [MediaCo sample application](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/mediaco-sample-application.html).

The **React SDK** has been tested with:
- node 18.12.1/18.13.0
- npm 8.19.2/8.19.3 

Future updates to the SDK will support more recent LTS versions of node as Constellation supports them.

**Before** installing and running the SDK code, refer to [Downloading the Constellation SDK files](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/installing-constellation-sdks.html) for steps to prepare your Infinity server and node environment so you can proceed with the steps in the next section.



<br>

---
# Installing and Running the Application
The following procedures provide an overview of installing Constellation SDKs and running the application. For detailed documentation, see [Installing and configuring Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/installing-configuring-constellation-sdks.html).

# Developing with the SDKs
You can find more details on how to integrate the latest React SDK into your development workflow and also instructions on the new using the new DX Component Builder for SDK features.

see [Development](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/development.html)

# Troubleshooting
Stuck?  Look at our [Troubleshooting Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/troubleshooting-constellation-sdks.html) which covers resolutions for most of the common problems.


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
* [Constellation SDKs Documentation](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/constellation-sdks.html)
* [Troubleshooting Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/troubleshooting-constellation-sdks.html)
* [MediaCo sample application](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/mediaco-sample-application.html)

