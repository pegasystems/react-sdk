# [25.1.11](https://github.com/pegasystems/react-sdk/tree/release/25.1.11) - Released: 20/03/2026

## Non Breaking changes

### **Features**

*   A new MediaCo theme has been introduced through the theme attribute in the sdk-config.json file for the **MediaCoSelfService** self-service portal.

    * Github: [PR-355](https://github.com/pegasystems/react-sdk/pull/599)

    **NOTE:** Please refer [What's New](https://pega-dev.zoominsoftware.io/bundle/constellation-sdk/page/constellation-sdks/sdks/react-sdk-updates.html) for more details.


*   Support for `light`, `dark`, and `MediaCo` themes has been introduced through the `theme` attribute in the **sdk-config.json** file. The `light` theme is applied by default. For more information, see [theme](https://pega-dev.zoominsoftware.io/bundle/constellation-sdk/page/constellation-sdks/sdks/configuring-sdk-config-json.html#configuring-the-sdk-config-json-con__theme).

*   `ListView` now supports `Select all`
    * Github: [PR-552](https://github.com/pegasystems/react-sdk-components/pull/552)
*   `Hierarchical form` component has been added.
    * Github: [PR-553](https://github.com/pegasystems/react-sdk-components/pull/553)
*   Added support for Error banners.
    * Github: [PR-555](https://github.com/pegasystems/react-sdk-components/pull/555)

---

### **Bug fixes**

*   **Fixed an issue causing excessive refresh calls for repeatingView in EmbeddedData**
      * Github: [PR-547](https://github.com/pegasystems/react-sdk-components/pull/547)
*   **Localization fixes have been made**
      * Github: [PR-554](https://github.com/pegasystems/react-sdk-components/pull/554), [PR-539](https://github.com/pegasystems/react-sdk-components/pull/539)
*  **Fixed an issue where column header labels were not displaying in the DataReference ReadOnly table**
      * Github: [PR-560](https://github.com/pegasystems/react-sdk-components/pull/560)
*   **Fixed the Confirmation view not getting renered issue**
      * Github: [PR-563](https://github.com/pegasystems/react-sdk-components/pull/563)

---

### **Dependencies & Infrastructure**

*   The `npm` vulerabilities have been reduced.
    * Github: [PR-607](https://github.com/pegasystems/react-sdk/pull/607)

*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **eslint-plugin-sonarjs** | 4.0.2 |
| **eslint-plugin-storybook** | 10.2.19 |
| **jest-environment-jsdom** | 30.3.0 |
| **serialize-javascript** | 7.0.3 |
