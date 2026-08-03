# [25.1.12](https://github.com/pegasystems/react-sdk/tree/release/25.1.12) - Released: 03/08/2026

## Breaking changes

*   None.

## Non Breaking changes

### **Bug fixes**
*   **Error in deleting attached files and Duplicate attachment files shown after being deleted**
      * Github: [PR-584](https://github.com/pegasystems/react-sdk-components/pull/584)
*   **Attachment upload in simple table manual component breaks the table code**
      * Github: [PR-606](https://github.com/pegasystems/react-sdk-components/pull/606)
*   **Placeholder unavailable for Dropdown component**
      * Github: [PR-580](https://github.com/pegasystems/react-sdk-components/pull/580)
*   **Label not displayed for Rich Text Fields**
      * Github: [PR-596](https://github.com/pegasystems/react-sdk-components/pull/596)
*   **Issues with applying column level filters on read-only simple tables**
      * Github: [PR-617](https://github.com/pegasystems/react-sdk-components/pull/617)
*   **Added a "No records found" message to the simple table for empty filter results**
      * Github: [PR-618](https://github.com/pegasystems/react-sdk-components/pull/618)
*   **Simple Table Modal edit/delete after sort or filter issue**
      * Github: [PR-619](https://github.com/pegasystems/react-sdk-components/pull/619)
*   **Fixed the issue where when you configured any action in the EmbeddedData field, and add a record, the configured fields do not appear**
      * Github: [PR-622](https://github.com/pegasystems/react-sdk-components/pull/622)

### **Dependencies & Infrastructure**

*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@pega/auth** | 0.2.43 |
| **@pega/constellationjs** | 25.1.3 |
| **@pega/dx-component-builder-sdk** | 25.1.16 |
| **@pega/react-sdk-components** | 25.1.12 |
| **@pega/react-sdk-overrides** | 25.1.12 |
| **jest** | 30.0.0 |
| **jest-environment-jsdom** | 30.4.0 |



# [25.1.11](https://github.com/pegasystems/react-sdk/tree/release/25.1.11) - Released: 23/03/2026

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
