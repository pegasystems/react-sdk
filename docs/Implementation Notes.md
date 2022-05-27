## Implementation Related Notes

Purpose of this file is to document things of interest related to the code to allow those who are extending or maintaining this code to better understand details about the implementation.  It also provides a means for capturing such summaries so lots of digging thru the code is not required to recollect the details about some portion of the implementation.

* React application structure (samples overview)

  * The root `index.html` file is located in the `src` directory and it contains references to various sdk and material stylesheet links
  * The `index.tsx` file contains BrowserRouter as the top level container and within it has the `TopLevelApp` component
  * The `TopLevelApp` component renders a div with id of `pega-root` (which is eventually replaced with Pega model driven content) and contains the `AppSelector` component
  * The `AppSelector` component has the DOM Router Switch for "/" (same as "/embedded"), "/embedded" (`EmbeddedTopLevel`) and "/portal" (Portal)
    * `EmbeddedTopLevel` brings in 3 instances of the `EmbeddedSwatch` component
