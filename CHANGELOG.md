# [26.1.10](https://github.com/pegasystems/react-sdk/tree/release/26.1.10) - Released: 27/08/2026

## Breaking changes

Note: Starting with Infinity version 26.1:

*  The metadata for CaseReference and DataReference have changed to ObjectReference. To support this change, the ObjectReference component has been refactored accordingly.
    * Github: [PR-577](https://github.com/pegasystems/react-sdk-components/pull/577)
*  The metadata for EmbeddedData has changed. To support this change, the EmbeddedDataMulti component has been introduced, and the SimpleTableManual component has been updated accordingly.
    * Github: [PR-585](https://github.com/pegasystems/react-sdk-components/pull/585)
*  Replaced TinyMCE with the Tiptap component in the Rich Text Editor.
    * Github: [PR-657](https://github.com/pegasystems/react-sdk-components/pull/657)

## Non Breaking changes

### **Features**

*  Added support for left and right alignment in the vertical stepper.
    * Github: [PR-623](https://github.com/pegasystems/react-sdk-components/pull/623)
*  Added support for primary fields in the Simple Table component.
    * Github: [PR-623](https://github.com/pegasystems/react-sdk-components/pull/623)
*  Added support for displaying warning messages in field components.
    * Github: [PR-625](https://github.com/pegasystems/react-sdk-components/pull/625)
*  Added support for displaying banner messages defined in the Dynamic Text rule.
    * Github: [PR-629](https://github.com/pegasystems/react-sdk-components/pull/629)
*  Added support for secondary fields in the AutoComplete component.
    * Github: [PR-633](https://github.com/pegasystems/react-sdk-components/pull/633)
*  Added support for grouping in the AutoComplete component.
    * Github: [PR-635](https://github.com/pegasystems/react-sdk-components/pull/635)
*  Added support for the Create New feature in AutoComplete Data Reference and Case Reference fields.
    * Github: [PR-637](https://github.com/pegasystems/react-sdk-components/pull/637)
*  Added row-based validation for the delete action in the Embedded Data editable table.
    * Github: [PR-659](https://github.com/pegasystems/react-sdk-components/pull/659)

### **Bug fixes**
*   **Fixed an issue where labels were not displayed on certain views.**
      * Github: [PR-623](https://github.com/pegasystems/react-sdk-components/pull/623)
*   **Fixed an issue with the request payload.**
      * Github: [PR-623](https://github.com/pegasystems/react-sdk-components/pull/623)
*   **Fixed an issue that caused an error when opening a Data instance record from the details view.**
      * Github: [PR-624](https://github.com/pegasystems/react-sdk-components/pull/624)
*   **Fixed an issue where the data reference value was not displayed correctly in the case summary view.**
      * Github: [PR-628](https://github.com/pegasystems/react-sdk-components/pull/628)
*   **Fixed an issue where repeating view collapse and expand states were not updated based on the prop.**
      * Github: [PR-631](https://github.com/pegasystems/react-sdk-components/pull/631)
*   **Fixed an issue where Boolean field labels were not visible in the details view.**
      * Github: [PR-632](https://github.com/pegasystems/react-sdk-components/pull/632)
*   **Fixed an issue where actions in the case summary were not displayed in the Data Object view.**
      * Github: [PR-636](https://github.com/pegasystems/react-sdk-components/pull/636)
*   **Fixed an issue where single-reference read-only field values were not displayed in the case summary view.**
      * Github: [PR-638](https://github.com/pegasystems/react-sdk-components/pull/638)
*   **Fixed an issue where AutoComplete generated duplicate options and console errors due to missing keys.**
      * Github: [PR-639](https://github.com/pegasystems/react-sdk-components/pull/639)
*   **Fixed an issue where the Table did not reflect updated values selected from the AutoComplete component.**
      * Github: [PR-639](https://github.com/pegasystems/react-sdk-components/pull/639)
*   **Fixed an issue with server-side filtering in the ListView component.**
      * Github: [PR-640](https://github.com/pegasystems/react-sdk-components/pull/640)
*   **Added catch blocks to handle previously unhandled promise rejections across components.**
      * Github: [PR-653](https://github.com/pegasystems/react-sdk-components/pull/653)
*   **Fixed an issue where primary field labels were not displayed in the confirmation template.**
      * Github: [PR-661](https://github.com/pegasystems/react-sdk-components/pull/661)
*   **Fixed an issue where duplicate entries were added to the Combobox when reselecting items.**
      * Github: [PR-662](https://github.com/pegasystems/react-sdk-components/pull/662)

*   The following table lists the packages whose versions have been updated:

---

### **Dependencies & Infrastructure**

*   The following table lists the packages whose versions have been updated:

| Package | Updated version |
| :--- | :--- |
| **@pega/auth** | 0.2.44 |
| **@pega/react-sdk-components** | 26.1.10 |
| **@pega/react-sdk-overrides** | 26.1.10 |
| **@pega/constellationjs** | 26.1.10 |

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
