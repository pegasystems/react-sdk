// Statically load all "local" components that aren't yet in the npm package

import FieldCheckbox from './src/components/override-sdk/field/Checkbox/';
import FieldTextInput from './src/components/override-sdk/field/TextInput/';
import FieldDate from './src/components/override-sdk/field/Date/';
import CheckAnswers from './src/components/custom-sdk/template/CheckAnswers/';
import ChangeLink from './src/components/custom-sdk/field/ChangeLink/';
import FieldRadioButtons from './src/components/override-sdk/field/RadioButtons/';
import TemplateDefaultForm from './src/components/override-sdk/template/DefaultForm/';
import InfraAssignmentCard from './src/components/override-sdk/infra/AssignmentCard/';
import InfraActionButtons from './src/components/override-sdk/infra/ActionButtons/';
import InfraAssignment from './src/components/override-sdk/infra/Assignment/';
import InfraFlowContainer from './src/components/override-sdk/infra/FlowContainer/';
import FieldPhone from './src/components/override-sdk/field/Phone/';
import InfraView from './src/components/override-sdk/infra/View/';
import TemplateCaseView from './src/components/override-sdk/template/CaseView/';
import FieldDropdown from './src/components/override-sdk/field/Dropdown/';
import TemplateFieldGroupTemplate from './src/components/override-sdk/template/FieldGroupTemplate/';
import TemplateDetails from './src/components/override-sdk/template/Details/';
import InfraViewContainer from './src/components/override-sdk/infra/ViewContainer/';
import MimicASentence from './src/components/custom-sdk/template/MimicASentence/'
import HmrcOdxGdsInfoPanel from './src/components/custom-sdk/template/HMRC_ODX_GDSInfoPanel/';
import HmrcOdxGdsSummaryCard from './src/components/custom-sdk/template/HMRC_ODX_GDSSummaryCard/';
import HmrcOdxGdsButton from './src/components/custom-sdk/field/HMRC_ODX_GDSButton/';
/*import end - DO NOT REMOVE*/

// localSdkComponentMap is the JSON object where we'll store the components that are
// found locally. If not found here, we'll look in the Pega-provided component map

const localSdkComponentMap = {
  "Checkbox" : FieldCheckbox,
  "TextInput" : FieldTextInput,
  "Date" : FieldDate,
  "HMRC_ODX_CheckAnswers" : CheckAnswers,
  "HMRC_ODX_ChangeLink" : ChangeLink,
  "HMRC_ODX_MimicASentence" : MimicASentence,
  "RadioButtons" : FieldRadioButtons,
  "DefaultForm" : TemplateDefaultForm,
  "Assignment" : InfraAssignment,
  "AssignmentCard" : InfraAssignmentCard,
  "ActionButtons" : InfraActionButtons,
  "Assignment" : InfraAssignment,
  "FlowContainer" : InfraFlowContainer,
  "HMRC_ODX_PhoneNumber" : FieldPhone,
  "View" : InfraView,
  "CaseView" : TemplateCaseView,
  "Dropdown" : FieldDropdown,
  "Group" : TemplateFieldGroupTemplate,
  "Details" : TemplateDetails,
  "ViewContainer" : InfraViewContainer,
  "HMRC_ODX_GDSInfoPanel" : HmrcOdxGdsInfoPanel,
  "HMRC_ODX_GDSSummaryCard" : HmrcOdxGdsSummaryCard,
  "HMRC_ODX_GDSButton" : HmrcOdxGdsButton,
/*map end - DO NOT REMOVE*/
};

export default localSdkComponentMap;
