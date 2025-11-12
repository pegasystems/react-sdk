<p align="center"><img width=60% src="docs/media/ReactSDK-Logo.png">

# React SDK - Release Announcement - v25.1.10

**SDK-R v25.1.10** is **only compatible with Pega Infinity '25** and is related to the [**release/25.1.10**](https://github.com/pegasystems/react-sdk/tree/release/25.1.10) branch of the React SDK repository.
<br>

**Note**: The main branch is the active development branch for future versions of React SDK.

This release allows React SDK users to take advantage of the latest SDK enhancements and fixes. For more information, see [ **What's New in SDK-R 25.1.10**](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/react-sdk-updates.html).
<br />

<hr>

**_IMPORTANT:_** Please follow the guidelines documented [here](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/upgrading-sdk.html) if you are upgrading from a previous version of React SDK.

---

# Overview

The **React SDK** combined with Pega's client orchestration APIs provides a guided iterative development workflow experience that accelerates integrating Pega’s Constellation DX API with an alternative (non-Pega) UI. Integrating an alternative design system is achieved using DX Components.

A DX component contains logic and presentation tags to merge the alternate design system with Pega’s client orchestration APIs.

The alternative design system used in the React SDK is [Material UI](https://v6.mui.com/). For more information about Constellation SDKs, see the [Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/constellation-sdks.html) documentation.

<br>

# Prerequisites

## Pega Infinity Server and Constellation-enabled Application

This version of the React SDK assumes that you have access to a Pega Infinity server (**25+**) running an application that is configured to run using the Constellation UI service.

The **MediaCo** sample application is already configured as a Constellation application and can be found in the React SDK download associated with this repo which is available [here](https://community.pega.com/marketplace/components/react-sdk). The OAuth 2.0 Client Registration records associated with the **MediaCo** application are available in the same React SDK download. For more information about the MediaCo sample application, see [MediaCo sample application](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/mediaco-sample-application.html).

The **React SDK** has been tested with:

- node 24.4.1
- npm 11.4.2

Future updates to the SDK will support more recent LTS versions of node as Constellation supports them.

**Before** installing and running the SDK code, refer to [Downloading the Constellation SDK files](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/installing-constellation-sdks.html) for steps to prepare your Pega Infinity server and node environment so you can proceed with the steps in the next section.

<br>

---

# Installing and Running the Application

The following procedures provide an overview of installing Constellation SDKs and running the application. For more information, see [Installing and configuring Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/installing-configuring-constellation-sdks.html).

# Developing with the SDKs

You can find more details on how to integrate the latest React SDK into your development workflow and also instructions on the new using the new DX Component Builder for SDK features.

For more information, see [Development](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/development.html).

# Troubleshooting

If you are facing any issues, please see [Troubleshooting Constellation SDKs](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/troubleshooting-constellation-sdks.html).

---

## License

This project is licensed under the terms of the **Apache 2** license.

> You can see the full license [here](LICENSE) or directly on [apache.org](https://www.apache.org/licenses/LICENSE-2.0).

<br>

---

## Contributing

We welcome contributions to the React SDK project.

Refer to our [guidelines for contributors](./docs/CONTRIBUTING.md) if you are interested in contributing to the project.
<br>

---
## Additional Resources

- [**Material UI**](https://v6.mui.com/)
- [**Constellation SDKs Documentation**](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/constellation-sdks.html)
- [**Troubleshooting Constellation SDKs**](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/troubleshooting-constellation-sdks.html)
- [**MediaCo sample application**](https://docs.pega.com/bundle/constellation-sdk/page/constellation-sdks/sdks/mediaco-sample-application.html)
