import { withKnobs } from "@storybook/addon-knobs";

import HmrcOdxGdsInfoPanel from "./index.tsx";

import operatorDetails, { pyReviewRaw } from "./mock.stories";

export default {
  title: "HmrcOdxGdsInfoPanel",
  decorators: [withKnobs],
  component: HmrcOdxGdsInfoPanel,
  parameters: {
    type: "DetailsRegion",
  },
};

export const BaseYourOrgRequiredDxilDetailsRegion = () => {
  if (!window.PCore) {
    window.PCore = {};
  }

  window.PCore.getUserApi = () => {
    return {
      getOperatorDetails: () => {
        return new Promise((resolve) => {
          resolve(operatorDetails);
        });
      },
    };
  };

  window.PCore.getEnvironmentInfo = () => {
    return {
      getUseLocale: () => {
        return "en-US";
      },
    };
  };

  const props = {
    NumCols: "2",
    template: "DefaultForm",
    showHighlightedData: false,
    label: "Details Region",
    showLabel: true,
    panelHeader: "SDK - We were unable to verify your child's details",
    panelText: "INFO_UNVERIFIED_CHILD",
    panelLink: "https://design-system.service.gov.uk/components/notification-banner/",
    panelType: "1",
    getPConnect: () => {
      return {
        getChildren: () => {
          return pyReviewRaw.children[0].children;
        },
        getRawMetadata: () => {
          return pyReviewRaw;
        },
        getInheritedProps: () => {
          return pyReviewRaw.config.inheritedProps;
        },
        setInheritedProp: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        },
      };
    },
  };

  return (
    <>
      <HmrcOdxGdsInfoPanel
        {...props}
      ></HmrcOdxGdsInfoPanel>
    </>
  );
};
