// import PropTypes from "prop-types";
// import SimpleTableWrapper from "../SimpleTable/SimpleTableWrapper";
// import { SIMPLE_TABLE_MANUAL_READONLY } from "../../RepeatingStructures/lib/Utils";

// export default function MultiReferenceReadonly(props) {
//   const { displayAs, getPConnect, label, hideLabel, config } = props;
//   const { referenceList, readonlyContextList } = config;
//   if (displayAs === "readonlyMulti" || displayAs === "combobox") {
//     return getPConnect().createComponent({
//       type: "SimpleTableSelectReadonly",
//       config: {
//         ...config,
//         label,
//         hideLabel,
//         displayAs
//       }
//     });
//   }
//   // When referenceList does not contain selected values, it should be replaced with readonlyContextList while calling SimpleTableManual
//   let readonlyContextObject;
//   if ( !PCore.getAnnotationUtils().isProperty(referenceList)) {
//     readonlyContextObject = {
//       referenceList: readonlyContextList
//     };
//   }

//   const component = getPConnect().createComponent({
//     type: "SimpleTableManual",
//     config: {
//       ...config,
//       ...readonlyContextObject,
//       label,
//       hideLabel,
//       classId: SIMPLE_TABLE_MANUAL_READONLY
//     }
//   });

//   return (
//     <SimpleTableWrapper component={component} />
//   )
// }

// MultiReferenceReadonly.defaultProps = {
//   displayAs: "",
//   label: "",
//   hideLabel: false
// };

// MultiReferenceReadonly.propTypes = {
//   // eslint-disable-next-line react/forbid-prop-types
//   config: PropTypes.object.isRequired,
//   getPConnect: PropTypes.func.isRequired,
//   displayAs: PropTypes.string,
//   label: PropTypes.string,
//   hideLabel: PropTypes.bool
// };
