const operatorDetails = {
  data: {
    pzLoadTime: "January 18, 2023 10:33:19 AM EST",
    pzPageNameHash: "_pa1519192551088960pz",
    pyOperatorInfo: {
      pyUserName: "french DigV2",
      pyPosition: "",
      pyImageInsKey: "",
      pySkills: [
        {
          pySkillName: "",
          pzIndexOwnerKey: "DATA-ADMIN-OPERATOR-ID FRENCHTEST.DIGV2",
          pySkillRating: 0,
        },
      ],
      pyReportToUserName: "",
      pyReportTo: "",
      pyOrganization: "DXIL",
      pyTitle: "",
      pyLabel: "frenchTest.DigV2",
      pyEmailAddress: "User@DigV2",
      pyTelephone: "",
    },
  },
  status: 200,
  statusText: "",
  headers: {
    "content-length": "435",
    "content-type": "application/json;charset=UTF-8",
  },
  request: {},
};

export default operatorDetails;

export const pyReviewRaw = {
  name: "pyReview",
  type: "View",
  config: {
    template: "Details",
    ruleClass: "MyCo-MyCompon-Work-MyComponents",
    showLabel: true,
    label: "@L Details",
    localeReference: "@LR MYCO-MYCOMPON-WORK-MYCOMPONENTS!VIEW!PYREVIEW",
    showHighlightedData: true,
    highlightedData: [
      {
        type: "TextInput",
        config: {
          value: "@P .pyStatusWork",
          label: "@L Work Status",
          displayMode: "STACKED_LARGE_VAL",
          displayAsStatus: true,
        },
      },
      {
        type: "TextInput",
        config: {
          value: "@P .pyID",
          label: "@L Case ID",
          displayMode: "STACKED_LARGE_VAL",
        },
      },
      {
        type: "DateTime",
        config: {
          value: "@P .pxCreateDateTime",
          label: "@L Create date/time",
          displayMode: "STACKED_LARGE_VAL",
        },
      },
      {
        type: "UserReference",
        config: {
          label: "@L Create Operator",
          value: "@USER .pxCreateOperator",
          placeholder: "Select...",
          displayMode: "STACKED_LARGE_VAL",
        },
      },
    ],
    inheritedProps: [
      {
        prop: "label",
        value: "@L Details",
      },
      {
        prop: "showLabel",
        value: true,
      },
    ],
  },
  children: [
    {
      name: "A",
      type: "Region",
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return pyReviewRaw.children[0];
          },
        };
      },
      children: [
        {
          readOnly: undefined,
          placeholder: "",
          value: "Check that the details you entered match their birth certificate",
          label: "Header",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
        },
        {
          readOnly: undefined,
          placeholder: "",
          value: "If you've just registered their birth, try again in 24 hours",
          label: "Header",
          hasSuggestions: false,
          displayMode: "LABELS_LEFT",
        },
      ],
    },
  ],
  classID: "MyCo-MyCompon-Work-MyComponents",
};
